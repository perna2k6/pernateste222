import { 
  type User, 
  type InsertUser,
  type AnalyticsEvent,
  type AnalyticsSession,
  type InsertAnalyticsEvent,
  type InsertAnalyticsSession
} from "@shared/schema";
import { randomUUID } from "crypto";

// modify the interface with any CRUD methods
// you might need

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Analytics methods
  createAnalyticsEvent(event: InsertAnalyticsEvent): Promise<AnalyticsEvent>;
  createAnalyticsSession(session: InsertAnalyticsSession): Promise<AnalyticsSession>;
  updateAnalyticsSession(sessionId: string, updates: Partial<AnalyticsSession>): Promise<AnalyticsSession | undefined>;
  getAnalyticsSession(sessionId: string): Promise<AnalyticsSession | undefined>;
  getAnalyticsEvents(sessionId?: string, limit?: number): Promise<AnalyticsEvent[]>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private analyticsEvents: Map<string, AnalyticsEvent>;
  private analyticsSessions: Map<string, AnalyticsSession>;

  constructor() {
    this.users = new Map();
    this.analyticsEvents = new Map();
    this.analyticsSessions = new Map();
  }

  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  // Analytics methods
  async createAnalyticsEvent(insertEvent: InsertAnalyticsEvent): Promise<AnalyticsEvent> {
    const id = randomUUID();
    const event: AnalyticsEvent = {
      ...insertEvent,
      id,
      timestamp: new Date(),
      eventData: insertEvent.eventData || null,
      userAgent: insertEvent.userAgent || null,
      viewport: insertEvent.viewport || null,
    };
    this.analyticsEvents.set(id, event);
    return event;
  }

  async createAnalyticsSession(insertSession: InsertAnalyticsSession): Promise<AnalyticsSession> {
    const now = new Date();
    const session: AnalyticsSession = {
      ...insertSession,
      startTime: now,
      lastActivity: now,
      userAgent: insertSession.userAgent || null,
      viewport: insertSession.viewport || null,
      totalTimeOnPage: insertSession.totalTimeOnPage || null,
      maxScrollDepth: insertSession.maxScrollDepth || null,
      pageViews: insertSession.pageViews || null,
    };
    this.analyticsSessions.set(session.id, session);
    return session;
  }

  async updateAnalyticsSession(sessionId: string, updates: Partial<AnalyticsSession>): Promise<AnalyticsSession | undefined> {
    const session = this.analyticsSessions.get(sessionId);
    if (!session) return undefined;
    
    const updatedSession: AnalyticsSession = {
      ...session,
      ...updates,
      lastActivity: new Date(),
    };
    this.analyticsSessions.set(sessionId, updatedSession);
    return updatedSession;
  }

  async getAnalyticsSession(sessionId: string): Promise<AnalyticsSession | undefined> {
    return this.analyticsSessions.get(sessionId);
  }

  async getAnalyticsEvents(sessionId?: string, limit = 100): Promise<AnalyticsEvent[]> {
    let events = Array.from(this.analyticsEvents.values());
    
    if (sessionId) {
      events = events.filter(event => event.sessionId === sessionId);
    }
    
    // Sort by timestamp descending and limit
    return events
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
      .slice(0, limit);
  }
}

export const storage = new MemStorage();
