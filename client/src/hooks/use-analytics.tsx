import { createContext, useContext, useEffect, useRef, useState, ReactNode } from "react";
import { 
  EventTypes, 
  EventNames, 
  type EventType, 
  type EventName,
  type InsertAnalyticsEvent,
  type InsertAnalyticsSession 
} from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";

interface AnalyticsContextType {
  trackEvent: (eventName: EventName, eventData?: Record<string, any>) => void;
  trackClick: (eventName: EventName, element?: string, eventData?: Record<string, any>) => void;
  trackConversion: (eventName: EventName, element?: string, eventData?: Record<string, any>) => Promise<void>;
  sessionId: string;
}

const AnalyticsContext = createContext<AnalyticsContextType | undefined>(undefined);

// Generate a unique session ID
const generateSessionId = (): string => {
  return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

// Debounce function
const debounce = <T extends (...args: any[]) => void>(func: T, wait: number): T => {
  let timeout: NodeJS.Timeout;
  return ((...args: any[]) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  }) as T;
};

// Detect viewport type
const getViewport = (): string => {
  if (typeof window === 'undefined') return 'unknown';
  const width = window.innerWidth;
  if (width < 768) return 'mobile';
  if (width < 1024) return 'tablet';
  return 'desktop';
};

// Get user agent
const getUserAgent = (): string => {
  return typeof navigator !== 'undefined' ? navigator.userAgent : '';
};

interface AnalyticsProviderProps {
  children: ReactNode;
}

export function AnalyticsProvider({ children }: AnalyticsProviderProps) {
  const [sessionId] = useState(() => generateSessionId());
  const sessionInitialized = useRef(false);
  const scrollDepthTracked = useRef(new Set<number>());
  const timeTracked = useRef(new Set<number>());
  const startTime = useRef(Date.now());
  const pausedTime = useRef(0);
  const isVisible = useRef(true);
  const lastPauseTime = useRef<number | null>(null);

  // Initialize session
  useEffect(() => {
    if (sessionInitialized.current) return;
    sessionInitialized.current = true;

    const initSession = async () => {
      try {
        const sessionData: InsertAnalyticsSession = {
          id: sessionId,
          userAgent: getUserAgent(),
          viewport: getViewport(),
          totalTimeOnPage: 0,
          maxScrollDepth: 0,
          pageViews: 1,
        };

        await apiRequest('POST', '/api/analytics/session', sessionData);

        // Track initial pageview
        trackEvent(EventNames.HOMEPAGE_VIEW);
      } catch (error) {
        console.warn('Analytics session initialization failed:', error);
      }
    };

    initSession();
  }, [sessionId]);

  // Track scroll depth with debouncing and NaN protection
  useEffect(() => {
    const handleScroll = debounce(() => {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      const documentHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      
      // Protect against NaN when documentHeight is 0
      let scrollDepth = 0;
      if (documentHeight > 0 && !isNaN(documentHeight) && !isNaN(scrollTop)) {
        scrollDepth = Math.round((scrollTop / documentHeight) * 100);
        scrollDepth = Math.max(0, Math.min(100, scrollDepth)); // Clamp between 0-100
      }

      // Track scroll depth milestones
      const milestones = [25, 50, 75, 100];
      milestones.forEach(milestone => {
        if (scrollDepth >= milestone && !scrollDepthTracked.current.has(milestone)) {
          scrollDepthTracked.current.add(milestone);
          const eventName = milestone === 25 ? EventNames.SCROLL_DEPTH_25 :
                           milestone === 50 ? EventNames.SCROLL_DEPTH_50 :
                           milestone === 75 ? EventNames.SCROLL_DEPTH_75 :
                           EventNames.SCROLL_DEPTH_100;
          trackEvent(eventName, { scrollDepth: milestone });
        }
      });

      // Update session with max scroll depth (debounced)
      debouncedUpdateSession({ maxScrollDepth: Math.max(scrollDepth, 0) });
    }, 100); // Debounce scroll events by 100ms

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Track time on page with proper pause/resume logic and reduced frequency
  useEffect(() => {
    const interval = setInterval(() => {
      if (!isVisible.current) return; // Don't track time when page is not visible
      
      const currentTime = Date.now();
      const activeTime = currentTime - startTime.current - pausedTime.current;
      const timeOnPage = Math.floor(activeTime / 1000);
      
      // Track time milestones
      const milestones = [30, 60, 120, 300];
      milestones.forEach(milestone => {
        if (timeOnPage >= milestone && !timeTracked.current.has(milestone)) {
          timeTracked.current.add(milestone);
          const eventName = milestone === 30 ? EventNames.TIME_ON_PAGE_30S :
                           milestone === 60 ? EventNames.TIME_ON_PAGE_60S :
                           milestone === 120 ? EventNames.TIME_ON_PAGE_120S :
                           EventNames.TIME_ON_PAGE_300S;
          trackEvent(eventName, { timeOnPage: milestone });
        }
      });

      // Update session with total time (reduced frequency to every 15 seconds)
      if (timeOnPage % 15 === 0) {
        updateSession({ totalTimeOnPage: timeOnPage });
      }
    }, 15000); // Changed from 1000ms to 15000ms (15 seconds)

    return () => clearInterval(interval);
  }, []);

  // Track page visibility changes with proper pause/resume logic
  useEffect(() => {
    const handleVisibilityChange = () => {
      const currentTime = Date.now();
      
      if (document.visibilityState === 'visible') {
        // Page became visible - resume timer
        isVisible.current = true;
        if (lastPauseTime.current !== null) {
          pausedTime.current += currentTime - lastPauseTime.current;
          lastPauseTime.current = null;
        }
      } else {
        // Page became hidden - pause timer
        isVisible.current = false;
        lastPauseTime.current = currentTime;
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, []);

  const updateSession = async (updates: Partial<InsertAnalyticsSession>) => {
    try {
      await apiRequest('PATCH', `/api/analytics/session/${sessionId}`, updates);
    } catch (error) {
      console.warn('Analytics session update failed:', error);
    }
  };

  // Debounced version of updateSession to reduce API calls
  const debouncedUpdateSession = debounce(updateSession, 2000);

  const trackConversion = async (eventName: EventName, element?: string, eventData?: Record<string, any>) => {
    const conversionData = {
      sessionId,
      eventType: getEventType(eventName),
      eventName,
      eventData: {
        element,
        timestamp: new Date().toISOString(),
        ...eventData,
      },
      userAgent: getUserAgent(),
      viewport: getViewport(),
    };

    try {
      // Use sendBeacon for reliable tracking on page unload
      if (navigator.sendBeacon) {
        const blob = new Blob([JSON.stringify(conversionData)], { type: 'application/json' });
        const success = navigator.sendBeacon('/api/analytics/event', blob);
        if (!success) {
          throw new Error('sendBeacon failed');
        }
      } else {
        // Fallback to fetch with keepalive
        await fetch('/api/analytics/event', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(conversionData),
          keepalive: true
        });
      }
    } catch (error) {
      console.warn('Conversion tracking failed:', error);
      // Fallback to regular tracking
      trackEvent(eventName, { element, ...eventData });
    }
  };

  const trackEvent = async (eventName: EventName, eventData?: Record<string, any>) => {
    try {
      const event: InsertAnalyticsEvent = {
        sessionId,
        eventType: getEventType(eventName),
        eventName,
        eventData: eventData || null,
        userAgent: getUserAgent(),
        viewport: getViewport(),
      };

      await apiRequest('POST', '/api/analytics/event', event);
    } catch (error) {
      console.warn('Analytics event tracking failed:', error);
    }
  };

  const trackClick = (eventName: EventName, element?: string, eventData?: Record<string, any>) => {
    const clickData = {
      element,
      timestamp: new Date().toISOString(),
      ...eventData,
    };
    trackEvent(eventName, clickData);
  };

  const getEventType = (eventName: EventName): EventType => {
    if (eventName.includes('scroll_depth')) return EventTypes.SCROLL;
    if (eventName.includes('time_on_page')) return EventTypes.TIME;
    if (eventName.includes('view')) return EventTypes.PAGEVIEW;
    return EventTypes.CLICK;
  };

  const value: AnalyticsContextType = {
    trackEvent,
    trackClick,
    trackConversion,
    sessionId,
  };

  return (
    <AnalyticsContext.Provider value={value}>
      {children}
    </AnalyticsContext.Provider>
  );
}

export function useAnalytics(): AnalyticsContextType {
  const context = useContext(AnalyticsContext);
  if (context === undefined) {
    throw new Error('useAnalytics must be used within an AnalyticsProvider');
  }
  return context;
}

// Convenience hook for tracking clicks
export function useAnalyticsClick() {
  const { trackClick, sessionId } = useAnalytics();
  
  const clickHandler = (eventName: EventName, element?: string, eventData?: Record<string, any>) => {
    trackClick(eventName, element, eventData);
  };
  
  // Attach sessionId for external access
  (clickHandler as any).__sessionId = sessionId;
  
  return clickHandler;
}

// Convenience hook for tracking conversions
export function useAnalyticsConversion() {
  const { trackConversion } = useAnalytics();
  
  return (eventName: EventName, element?: string, eventData?: Record<string, any>) => {
    return trackConversion(eventName, element, eventData);
  };
}

// Convenience hook for tracking custom events
export function useAnalyticsEvent() {
  const { trackEvent } = useAnalytics();
  
  return (eventName: EventName, eventData?: Record<string, any>) => {
    trackEvent(eventName, eventData);
  };
}