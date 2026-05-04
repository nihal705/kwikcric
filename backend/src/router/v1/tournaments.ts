import { Router } from 'express';
import { query } from '../../config/database/postgres';

const router = Router();

// IPL data
const iplData: Record<number, any> = {
  2024: { winner: 'Kolkata Knight Riders', runnerUp: 'Sunrisers Hyderabad' },
  2023: { winner: 'Chennai Super Kings', runnerUp: 'Gujarat Titans' },
  2022: { winner: 'Gujarat Titans', runnerUp: 'Rajasthan Royals' },
  2021: { winner: 'Chennai Super Kings', runnerUp: 'Kolkata Knight Riders' },
  2020: { winner: 'Mumbai Indians', runnerUp: 'Delhi Capitals' },
};

router.get('/ipl/:year', (req, res) => {
  const year = parseInt(req.params.year);
  const data = iplData[year];
  if (!data) return res.status(404).json({ error: 'Not found' });
  res.json({ success: true, data });
});

// ============================================
// WORLD CUP WINNERS API
// ============================================

// Get ODI World Cup winners
router.get('/world-cup/winners', async (req, res) => {
  try {
    const result = await query(`
      SELECT t.name as team_name, COUNT(*) as wins
      FROM world_cup_tournaments wc
      JOIN teams t ON wc.winner_team_id = t.id
      WHERE wc.tournament_type = 'odi'
      GROUP BY t.name
      ORDER BY wins DESC, t.name
    `);
    
    if (result.rows.length === 0) {
      // Fallback data if no data in database
      return res.json({ 
        success: true, 
        data: [
          { team_name: 'Australia', wins: 5 },
          { team_name: 'India', wins: 2 },
          { team_name: 'West Indies', wins: 2 },
          { team_name: 'England', wins: 1 },
          { team_name: 'Pakistan', wins: 1 },
          { team_name: 'Sri Lanka', wins: 1 },
        ] 
      });
    }
    
    res.json({ success: true, data: result.rows });
  } catch (error) {
    console.error('Error fetching World Cup winners:', error);
    // Fallback data on error
    res.json({ 
      success: true, 
      data: [
        { team_name: 'Australia', wins: 5 },
        { team_name: 'India', wins: 2 },
        { team_name: 'West Indies', wins: 2 },
        { team_name: 'England', wins: 1 },
        { team_name: 'Pakistan', wins: 1 },
        { team_name: 'Sri Lanka', wins: 1 },
      ] 
    });
  }
});

// Get T20 World Cup winners
router.get('/t20-world-cup/winners', async (req, res) => {
  try {
    const result = await query(`
      SELECT t.name as team_name, COUNT(*) as wins
      FROM world_cup_tournaments wc
      JOIN teams t ON wc.winner_team_id = t.id
      WHERE wc.tournament_type = 't20'
      GROUP BY t.name
      ORDER BY wins DESC, t.name
    `);
    
    if (result.rows.length === 0) {
      return res.json({ 
        success: true, 
        data: [
          { team_name: 'India', wins: 2 },
          { team_name: 'England', wins: 2 },
          { team_name: 'West Indies', wins: 2 },
          { team_name: 'Australia', wins: 1 },
          { team_name: 'Pakistan', wins: 1 },
          { team_name: 'Sri Lanka', wins: 1 },
        ] 
      });
    }
    
    res.json({ success: true, data: result.rows });
  } catch (error) {
    console.error('Error fetching T20 World Cup winners:', error);
    res.json({ 
      success: true, 
      data: [
        { team_name: 'India', wins: 2 },
        { team_name: 'England', wins: 2 },
        { team_name: 'West Indies', wins: 2 },
        { team_name: 'Australia', wins: 1 },
        { team_name: 'Pakistan', wins: 1 },
        { team_name: 'Sri Lanka', wins: 1 },
      ] 
    });
  }
});

// Get Champions Trophy winners
router.get('/champions-trophy/winners', async (req, res) => {
  try {
    const result = await query(`
      SELECT t.name as team_name, COUNT(*) as wins
      FROM world_cup_tournaments wc
      JOIN teams t ON wc.winner_team_id = t.id
      WHERE wc.tournament_type = 'champions'
      GROUP BY t.name
      ORDER BY wins DESC, t.name
    `);
    
    if (result.rows.length === 0) {
      return res.json({ 
        success: true, 
        data: [
          { team_name: 'India', wins: 2 },
          { team_name: 'Australia', wins: 2 },
          { team_name: 'England', wins: 1 },
          { team_name: 'Pakistan', wins: 1 },
          { team_name: 'Sri Lanka', wins: 1 },
          { team_name: 'West Indies', wins: 1 },
          { team_name: 'New Zealand', wins: 1 },
        ] 
      });
    }
    
    res.json({ success: true, data: result.rows });
  } catch (error) {
    console.error('Error fetching Champions Trophy winners:', error);
    res.json({ 
      success: true, 
      data: [
        { team_name: 'India', wins: 2 },
        { team_name: 'Australia', wins: 2 },
        { team_name: 'England', wins: 1 },
        { team_name: 'Pakistan', wins: 1 },
        { team_name: 'Sri Lanka', wins: 1 },
        { team_name: 'West Indies', wins: 1 },
        { team_name: 'New Zealand', wins: 1 },
      ] 
    });
  }
});

router.get('/live', (req, res) => {
  res.json({ success: true, data: [{ id: 1, team1: 'India', team2: 'Australia', status: 'live' }] });
});

router.get('/upcoming', (req, res) => {
  res.json({ success: true, data: [{ id: 2, team1: 'England', team2: 'New Zealand', date: '2024-01-20' }] });
});

export default router;