import { useEffect } from 'react';
import { onCLS, onINP, onFCP, onLCP, onTTFB } from 'web-vitals';

interface VitalMetric {
  name: string;
  value: number;
  rating: 'good' | 'needs-improvement' | 'poor';
  delta: number;
  id: string;
}

const usePerformanceMonitoring = () => {
  useEffect(() => {
    // Log performance metrics to console (can be replaced with analytics service)
    const logMetric = (metric: VitalMetric) => {
      console.group(`📊 Web Vital: ${metric.name}`);
      console.log(`Value: ${metric.value.toFixed(2)}ms`);
      console.log(`Rating: ${metric.rating}`);
      console.log(`ID: ${metric.id}`);
      console.groupEnd();

      // Send to analytics (optional - can be integrated with existing analytics)
      if (typeof window !== 'undefined' && (window as any).gtag) {
        (window as any).gtag('event', metric.name, {
          value: Math.round(metric.value),
          custom_parameter_1: metric.rating,
          custom_parameter_2: metric.id,
        });
      }
    };

    // Monitor Core Web Vitals
    onCLS(logMetric); // Cumulative Layout Shift
    onINP(logMetric); // Interaction to Next Paint (replaces FID)
    onFCP(logMetric); // First Contentful Paint
    onLCP(logMetric); // Largest Contentful Paint
    onTTFB(logMetric); // Time to First Byte
  }, []);
};

export default usePerformanceMonitoring;