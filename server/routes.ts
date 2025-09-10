import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { 
  insertAnalyticsEventSchema, 
  insertAnalyticsSessionSchema,
  type InsertAnalyticsEvent,
  type InsertAnalyticsSession
} from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Analytics routes
  
  // Create analytics event
  app.post('/api/analytics/event', async (req, res) => {
    try {
      const eventData = insertAnalyticsEventSchema.parse(req.body);
      const event = await storage.createAnalyticsEvent(eventData);
      res.json({ success: true, event });
    } catch (error) {
      console.error('Analytics event creation failed:', error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({ 
          success: false, 
          error: 'Invalid event data', 
          details: error.errors 
        });
      }
      res.status(500).json({ success: false, error: 'Internal server error' });
    }
  });

  // Create analytics session
  app.post('/api/analytics/session', async (req, res) => {
    try {
      const sessionData = insertAnalyticsSessionSchema.parse(req.body);
      const session = await storage.createAnalyticsSession(sessionData);
      res.json({ success: true, session });
    } catch (error) {
      console.error('Analytics session creation failed:', error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({ 
          success: false, 
          error: 'Invalid session data', 
          details: error.errors 
        });
      }
      res.status(500).json({ success: false, error: 'Internal server error' });
    }
  });

  // Update analytics session
  app.patch('/api/analytics/session/:sessionId', async (req, res) => {
    try {
      const { sessionId } = req.params;
      const updates = req.body;
      
      // Validate that sessionId is provided
      if (!sessionId) {
        return res.status(400).json({ 
          success: false, 
          error: 'Session ID is required' 
        });
      }

      const session = await storage.updateAnalyticsSession(sessionId, updates);
      if (!session) {
        return res.status(404).json({ 
          success: false, 
          error: 'Session not found' 
        });
      }
      
      res.json({ success: true, session });
    } catch (error) {
      console.error('Analytics session update failed:', error);
      res.status(500).json({ success: false, error: 'Internal server error' });
    }
  });

  // Get analytics session (optional, for debugging)
  app.get('/api/analytics/session/:sessionId', async (req, res) => {
    try {
      const { sessionId } = req.params;
      const session = await storage.getAnalyticsSession(sessionId);
      
      if (!session) {
        return res.status(404).json({ 
          success: false, 
          error: 'Session not found' 
        });
      }
      
      res.json({ success: true, session });
    } catch (error) {
      console.error('Analytics session retrieval failed:', error);
      res.status(500).json({ success: false, error: 'Internal server error' });
    }
  });

  // Get analytics events (optional, for debugging)
  app.get('/api/analytics/events', async (req, res) => {
    try {
      const { sessionId, limit } = req.query;
      const events = await storage.getAnalyticsEvents(
        sessionId as string | undefined,
        limit ? parseInt(limit as string) : undefined
      );
      
      res.json({ success: true, events, count: events.length });
    } catch (error) {
      console.error('Analytics events retrieval failed:', error);
      res.status(500).json({ success: false, error: 'Internal server error' });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
