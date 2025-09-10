import { sql } from "drizzle-orm";
import { pgTable, text, varchar, timestamp, integer, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

// Analytics schema
export const analyticsEvents = pgTable("analytics_events", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  sessionId: varchar("session_id").notNull(),
  eventType: varchar("event_type").notNull(), // 'click', 'scroll', 'time', 'pageview'
  eventName: varchar("event_name").notNull(), // specific event identifier
  eventData: jsonb("event_data"), // additional event data
  timestamp: timestamp("timestamp").notNull().default(sql`now()`),
  userAgent: text("user_agent"),
  viewport: varchar("viewport"), // "mobile" | "desktop" | "tablet"
});

export const analyticsSessions = pgTable("analytics_sessions", {
  id: varchar("id").primaryKey(),
  startTime: timestamp("start_time").notNull().default(sql`now()`),
  lastActivity: timestamp("last_activity").notNull().default(sql`now()`),
  totalTimeOnPage: integer("total_time_on_page").default(0), // in seconds
  maxScrollDepth: integer("max_scroll_depth").default(0), // percentage
  pageViews: integer("page_views").default(1),
  userAgent: text("user_agent"),
  viewport: varchar("viewport"),
});

// Analytics event schemas for validation
export const insertAnalyticsEventSchema = createInsertSchema(analyticsEvents).omit({
  id: true,
  timestamp: true,
});

export const insertAnalyticsSessionSchema = createInsertSchema(analyticsSessions).omit({
  startTime: true,
  lastActivity: true,
});

// Types
export type InsertAnalyticsEvent = z.infer<typeof insertAnalyticsEventSchema>;
export type AnalyticsEvent = typeof analyticsEvents.$inferSelect;
export type InsertAnalyticsSession = z.infer<typeof insertAnalyticsSessionSchema>;
export type AnalyticsSession = typeof analyticsSessions.$inferSelect;

// Event type enums for frontend use
export const EventTypes = {
  CLICK: 'click',
  SCROLL: 'scroll', 
  TIME: 'time',
  PAGEVIEW: 'pageview',
} as const;

export const EventNames = {
  // CTA Button clicks
  HERO_CTA: 'hero_cta_click',
  WHY_CHOOSE_CTA: 'why_choose_cta_click',
  COLLECTION_CTA: 'collection_cta_click',
  
  // Package purchase buttons
  BASIC_PACKAGE: 'basic_package_click',
  PREMIUM_PACKAGE: 'premium_package_click',
  
  // Carousel interactions
  BOOKS_CAROUSEL_PREV: 'books_carousel_prev',
  BOOKS_CAROUSEL_NEXT: 'books_carousel_next', 
  TESTIMONIALS_CAROUSEL_PREV: 'testimonials_carousel_prev',
  TESTIMONIALS_CAROUSEL_NEXT: 'testimonials_carousel_next',
  
  // FAQ interactions
  FAQ_TOGGLE: 'faq_toggle',
  
  // Scroll tracking
  SCROLL_DEPTH_25: 'scroll_depth_25',
  SCROLL_DEPTH_50: 'scroll_depth_50',
  SCROLL_DEPTH_75: 'scroll_depth_75',
  SCROLL_DEPTH_100: 'scroll_depth_100',
  
  // Time tracking
  TIME_ON_PAGE_30S: 'time_on_page_30s',
  TIME_ON_PAGE_60S: 'time_on_page_60s',
  TIME_ON_PAGE_120S: 'time_on_page_120s',
  TIME_ON_PAGE_300S: 'time_on_page_300s',
  
  // Page views
  HOMEPAGE_VIEW: 'homepage_view',
} as const;

export type EventType = typeof EventTypes[keyof typeof EventTypes];
export type EventName = typeof EventNames[keyof typeof EventNames];
