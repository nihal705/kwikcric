import { z } from 'zod';

export const createPlayerValidator = z.object({
  uniqueIdentifier: z.string()
    .min(3, 'Unique identifier must be at least 3 characters')
    .regex(/^[a-z0-9-]+$/, 'Identifier can only contain lowercase letters, numbers, and hyphens'),
  fullName: z.string()
    .min(2, 'Full name must be at least 2 characters')
    .max(100, 'Full name must be less than 100 characters'),
  firstName: z.string().max(50).optional(),
  lastName: z.string().max(50).optional(),
  country: z.string()
    .min(2, 'Country is required')
    .max(50, 'Country must be less than 50 characters'),
  role: z.enum(['Batsman', 'Bowler', 'All-rounder', 'Wicket-keeper']).optional(),
  battingStyle: z.string().max(50).optional(),
  bowlingStyle: z.string().max(50).optional(),
  imageUrl: z.string().url().optional(),
  dateOfBirth: z.string().datetime().optional(),
  bio: z.string().max(5000).optional(),
  isActive: z.boolean().optional(),
});

export const updatePlayerValidator = z.object({
  fullName: z.string().min(2).max(100).optional(),
  country: z.string().min(2).max(50).optional(),
  role: z.enum(['Batsman', 'Bowler', 'All-rounder', 'Wicket-keeper']).optional(),
  battingStyle: z.string().max(50).optional(),
  bowlingStyle: z.string().max(50).optional(),
  imageUrl: z.string().url().optional(),
  bio: z.string().max(5000).optional(),
  isActive: z.boolean().optional(),
});

export const playerStatsValidator = z.object({
  format: z.enum(['Test', 'ODI', 'T20I', 'IPL', 'BBL', 'PSL', 'CPL']),
  matches: z.number().int().min(0),
  runs: z.number().int().min(0),
  wickets: z.number().int().min(0),
  hundreds: z.number().int().min(0),
  fifties: z.number().int().min(0),
  battingAverage: z.number().min(0).optional(),
  bowlingAverage: z.number().min(0).optional(),
  strikeRate: z.number().min(0).optional(),
  economyRate: z.number().min(0).optional(),
  year: z.number().int().min(1900).max(new Date().getFullYear()).optional(),
});

export const searchPlayersValidator = z.object({
  q: z.string().min(1, 'Search query required'),
  limit: z.number().int().min(1).max(100).default(10),
  country: z.string().optional(),
  role: z.string().optional(),
});

export const comparePlayersValidator = z.object({
  player1Id: z.string().uuid(),
  player2Id: z.string().uuid(),
});