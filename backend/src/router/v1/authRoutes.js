// backend/src/router/v1/authRoutes.js
const express = require('express');
const bcrypt = require('bcrypt');
const { Pool } = require('pg');
const crypto = require('crypto');
const { generateToken, optionalVerifyToken } = require('../../middleware/auth');

const router = express.Router();

const pool = new Pool({
    host: 'localhost',
    port: 5432,
    database: 'Your_db_name',
    user: 'your_user_name',
    password: 'your_password_here',
});

// Generate unique guest ID
function generateGuestId() {
    return 'guest_' + crypto.randomBytes(16).toString('hex');
}

// Register new user (email/password)
router.post('/register', async (req, res) => {
    try {
        const { username, email, password } = req.body;
        
        // Check if user exists
        const existingUser = await pool.query(
            'SELECT id FROM users WHERE email = $1 OR username = $2',
            [email, username]
        );
        
        if (existingUser.rows.length > 0) {
            return res.status(400).json({ error: 'User already exists' });
        }
        
        // Hash password
        const saltRounds = 10;
        const passwordHash = await bcrypt.hash(password, saltRounds);
        
        // Create user
        const result = await pool.query(
            `INSERT INTO users (username, email, password_hash, is_guest) 
             VALUES ($1, $2, $3, false) 
             RETURNING id, username, email`,
            [username, email, passwordHash]
        );
        
        const user = result.rows[0];
        const token = generateToken(user.id, user.username);
        
        // Create user stats entry
        await pool.query(
            `INSERT INTO kwik_cricket_user_stats (user_id) VALUES ($1)`,
            [user.id]
        );
        
        res.json({ success: true, token, user: { id: user.id, username: user.username, email: user.email } });
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ error: error.message });
    }
});

// Login user
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        
        const result = await pool.query(
            'SELECT id, username, email, password_hash FROM users WHERE email = $1 AND is_guest = false',
            [email]
        );
        
        if (result.rows.length === 0) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }
        
        const user = result.rows[0];
        const validPassword = await bcrypt.compare(password, user.password_hash);
        
        if (!validPassword) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }
        
        // Update last login
        await pool.query(
            'UPDATE users SET last_login = CURRENT_TIMESTAMP WHERE id = $1',
            [user.id]
        );
        
        const token = generateToken(user.id, user.username);
        
        res.json({ 
            success: true, 
            token, 
            user: { id: user.id, username: user.username, email: user.email } 
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ error: error.message });
    }
});

// Create/Get guest session
router.post('/guest', async (req, res) => {
    try {
        let { guestId } = req.body;
        
        if (!guestId) {
            guestId = generateGuestId();
        }
        
        // Check if guest exists
        let result = await pool.query(
            'SELECT id, username, guest_id FROM users WHERE guest_id = $1 AND is_guest = true',
            [guestId]
        );
        
        if (result.rows.length === 0) {
            // Create new guest user
            result = await pool.query(
                `INSERT INTO users (username, guest_id, is_guest) 
                 VALUES ($1, $2, true) 
                 RETURNING id, username, guest_id`,
                [`Guest_${guestId.slice(-8)}`, guestId]
            );
            
            const guest = result.rows[0];
            
            // Create user stats
            await pool.query(
                `INSERT INTO kwik_cricket_user_stats (user_id) VALUES ($1)`,
                [guest.id]
            );
        }
        
        const guest = result.rows[0];
        const token = generateToken(guest.id, guest.username);
        
        res.json({ 
            success: true, 
            token, 
            guestId,
            user: { id: guest.id, username: guest.username, isGuest: true } 
        });
    } catch (error) {
        console.error('Guest session error:', error);
        res.status(500).json({ error: error.message });
    }
});

// Merge guest stats into registered account
router.post('/merge-guest', optionalVerifyToken, async (req, res) => {
    try {
        const { guestStats, guestHistory, guestId } = req.body;
        const userId = req.user?.userId;
        
        if (!userId) {
            return res.status(401).json({ error: 'User not authenticated' });
        }
        
        // Update user stats with guest stats
        if (guestStats) {
            await pool.query(
                `UPDATE kwik_cricket_user_stats 
                 SET matches_played = matches_played + $1,
                     matches_won = matches_won + $2,
                     total_runs = total_runs + $3,
                     total_wickets = total_wickets + $4,
                     highest_score = GREATEST(highest_score, $5),
                     updated_at = CURRENT_TIMESTAMP
                 WHERE user_id = $6`,
                [
                    guestStats.matches_played || 0,
                    guestStats.matches_won || 0,
                    guestStats.total_runs || 0,
                    guestStats.total_wickets || 0,
                    guestStats.highest_score || 0,
                    userId
                ]
            );
        }
        
        // Add guest match history
        if (guestHistory && guestHistory.length > 0) {
            for (const match of guestHistory) {
                await pool.query(
                    `INSERT INTO kwik_cricket_match_history 
                     (user_id, user_team, opponent_team, overs, user_score, user_wickets, opponent_score, opponent_wickets, result)
                     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
                    [
                        userId,
                        match.userTeam,
                        match.opponentTeam,
                        match.overs,
                        match.userScore,
                        match.userWickets,
                        match.opponentScore,
                        match.opponentWickets,
                        match.result
                    ]
                );
            }
        }
        
        // Delete guest user
        if (guestId) {
            await pool.query('DELETE FROM users WHERE guest_id = $1 AND is_guest = true', [guestId]);
        }
        
        res.json({ success: true, message: 'Guest data merged successfully' });
    } catch (error) {
        console.error('Merge error:', error);
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
