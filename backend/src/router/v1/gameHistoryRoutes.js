// backend/src/router/v1/gameHistoryRoutes.js
const express = require('express');
const { Pool } = require('pg');
const { verifyToken } = require('../../middleware/auth');

const router = express.Router();
const pool = new Pool({
    host: 'localhost',
    port: 5432,
    database: 'cricket_universe',
    user: 'postgres',
    password: 'Nihal@786313',
});

// Save game session
router.post('/save-session', verifyToken, async (req, res) => {
    const { gameType, gameMode, state, score } = req.body;
    const userId = req.user.userId;
    
    await pool.query(`
        INSERT INTO user_game_sessions (user_id, game_type, game_mode, session_data, score, status, last_played_at)
        VALUES ($1, $2, $3, $4, $5, 'in_progress', CURRENT_TIMESTAMP)
        ON CONFLICT (user_id, game_type, game_mode) DO UPDATE SET
            session_data = EXCLUDED.session_data,
            score = EXCLUDED.score,
            last_played_at = CURRENT_TIMESTAMP
    `, [userId, gameType, gameMode, JSON.stringify(state), score]);
    
    res.json({ success: true });
});

// Load game session
router.get('/load-session/:gameType/:gameMode', verifyToken, async (req, res) => {
    const { gameType, gameMode } = req.params;
    const userId = req.user.userId;
    
    const result = await pool.query(`
        SELECT session_data, score FROM user_game_sessions 
        WHERE user_id = $1 AND game_type = $2 AND game_mode = $3 AND status = 'in_progress'
    `, [userId, gameType, gameMode]);
    
    if (result.rows.length > 0) {
        res.json({ state: result.rows[0].session_data, score: result.rows[0].score });
    } else {
        res.json({ state: null });
    }
});

// Clear game session
router.delete('/clear-session/:gameType/:gameMode', verifyToken, async (req, res) => {
    const { gameType, gameMode } = req.params;
    const userId = req.user.userId;
    
    await pool.query(`
        UPDATE user_game_sessions 
        SET status = 'completed', completed_at = CURRENT_TIMESTAMP
        WHERE user_id = $1 AND game_type = $2 AND game_mode = $3
    `, [userId, gameType, gameMode]);
    
    res.json({ success: true });
});

// Save game history
router.post('/history', verifyToken, async (req, res) => {
    const { gameType, gameMode, score, accuracy, result, details } = req.body;
    const userId = req.user.userId;
    
    await pool.query(`
        INSERT INTO game_history (user_id, game_type, game_mode, score, accuracy, result, details)
        VALUES ($1, $2, $3, $4, $5, $6, $7)
    `, [userId, gameType, gameMode, score, accuracy, result, JSON.stringify(details)]);
    
    res.json({ success: true });
});

// Get game history
router.get('/history/:gameType', verifyToken, async (req, res) => {
    const { gameType } = req.params;
    const userId = req.user.userId;
    const limit = parseInt(req.query.limit) || 20;
    
    const result = await pool.query(`
        SELECT * FROM game_history 
        WHERE user_id = $1 AND game_type = $2 
        ORDER BY played_at DESC 
        LIMIT $3
    `, [userId, gameType, limit]);
    
    res.json(result.rows);
});

// Get overall stats
router.get('/stats', verifyToken, async (req, res) => {
    const userId = req.user.userId;
    
    const result = await pool.query(`
        SELECT 
            game_type,
            COUNT(*) as total_games,
            SUM(score) as total_score,
            AVG(accuracy) as avg_accuracy
        FROM game_history 
        WHERE user_id = $1 
        GROUP BY game_type
    `, [userId]);
    
    const stats = {};
    result.rows.forEach(row => {
        stats[row.game_type] = {
            totalGames: parseInt(row.total_games),
            totalScore: parseInt(row.total_score),
            accuracy: Math.round(row.avg_accuracy || 0)
        };
    });
    
    res.json(stats);
});

module.exports = router;