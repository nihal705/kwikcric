// backend/src/router/v1/kwikCricketRoutes.js
const express = require('express');
const { Pool } = require('pg');
const { verifyToken, optionalVerifyToken } = require('../../middleware/auth');

const router = express.Router();

const pool = new Pool({
    host: 'localhost',
    port: 5432,
    database: 'Your_db_name',
    user: 'your_user_name',
    password: 'your_password_here',
});

// Save match (with user authentication)
router.post('/save-match', optionalVerifyToken, async (req, res) => {
    try {
        const { 
            userTeam, 
            opponentTeam, 
            overs, 
            userScore, 
            userWickets, 
            opponentScore, 
            opponentWickets, 
            result 
        } = req.body;
        
        const userId = req.user?.userId;
        
        if (!userId) {
            // Guest mode - just return success without saving
            return res.json({ success: true, message: 'Guest mode - not saved' });
        }
        
        // Save match to history
        await pool.query(`
            INSERT INTO kwik_cricket_match_history 
            (user_id, user_team, opponent_team, overs, user_score, user_wickets, opponent_score, opponent_wickets, result)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
        `, [userId, userTeam, opponentTeam, overs, userScore, userWickets, opponentScore, opponentWickets, result]);
        
        // Update user stats
        await pool.query(`
            UPDATE kwik_cricket_user_stats 
            SET matches_played = matches_played + 1,
                matches_won = matches_won + $1,
                total_runs = total_runs + $2,
                total_wickets = total_wickets + $3,
                highest_score = GREATEST(highest_score, $2),
                updated_at = CURRENT_TIMESTAMP
            WHERE user_id = $4
        `, [result === 'win' ? 1 : 0, userScore, userWickets, userId]);
        
        res.json({ success: true });
    } catch (error) {
        console.error('Error saving match:', error);
        res.status(500).json({ error: error.message });
    }
});

// Get user stats
router.get('/stats', verifyToken, async (req, res) => {
    try {
        const userId = req.user.userId;
        
        const result = await pool.query(`
            SELECT * FROM kwik_cricket_user_stats WHERE user_id = $1
        `, [userId]);
        
        res.json({ success: true, data: result.rows[0] || null });
    } catch (error) {
        console.error('Error fetching stats:', error);
        res.status(500).json({ error: error.message });
    }
});

// Get match history
router.get('/history', verifyToken, async (req, res) => {
    try {
        const userId = req.user.userId;
        const limit = parseInt(req.query.limit) || 10;
        
        const result = await pool.query(`
            SELECT * FROM kwik_cricket_match_history 
            WHERE user_id = $1 
            ORDER BY played_at DESC 
            LIMIT $2
        `, [userId, limit]);
        
        res.json({ success: true, data: result.rows });
    } catch (error) {
        console.error('Error fetching history:', error);
        res.status(500).json({ error: error.message });
    }
});

// Save game state (for continue feature)
router.post('/save-game', verifyToken, async (req, res) => {
    try {
        const userId = req.user.userId;
        const { gameState } = req.body;
        
        await pool.query(`
            INSERT INTO kwik_cricket_saved_games (user_id, game_state)
            VALUES ($1, $2)
            ON CONFLICT (user_id) DO UPDATE SET 
                game_state = EXCLUDED.game_state,
                saved_at = CURRENT_TIMESTAMP
        `, [userId, JSON.stringify(gameState)]);
        
        res.json({ success: true });
    } catch (error) {
        console.error('Error saving game:', error);
        res.status(500).json({ error: error.message });
    }
});

// Load game state
router.get('/load-game', verifyToken, async (req, res) => {
    try {
        const userId = req.user.userId;
        
        const result = await pool.query(`
            SELECT game_state FROM kwik_cricket_saved_games WHERE user_id = $1
        `, [userId]);
        
        res.json({ success: true, data: result.rows[0]?.game_state || null });
    } catch (error) {
        console.error('Error loading game:', error);
        res.status(500).json({ error: error.message });
    }
});

// Clear saved game
router.delete('/clear-game', verifyToken, async (req, res) => {
    try {
        const userId = req.user.userId;
        
        await pool.query(`
            DELETE FROM kwik_cricket_saved_games WHERE user_id = $1
        `, [userId]);
        
        res.json({ success: true });
    } catch (error) {
        console.error('Error clearing game:', error);
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
