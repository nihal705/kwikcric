// backend/src/router/v1/pollRoutes.js
const express = require('express');
const { Pool } = require('pg');

const router = express.Router();

const pool = new Pool({
    host: 'localhost',
    port: 5432,
    database: 'Your_db_name',
    user: 'your_user_name',
    password: 'your_password_here',
});

// Get active weekly poll with all questions
router.get('/weekly/active', async (req, res) => {
    try {
        // Get active weekly poll
        const pollResult = await pool.query(`
            SELECT id, week_number, year, start_date, end_date
            FROM weekly_polls
            WHERE is_active = true AND CURRENT_DATE BETWEEN start_date AND end_date
            LIMIT 1
        `);
        
        if (pollResult.rows.length === 0) {
            return res.json({ success: true, data: null, message: 'No active poll' });
        }
        
        const weeklyPoll = pollResult.rows[0];
        
        // Get questions for this poll
        const questionsResult = await pool.query(`
            SELECT id, question, option_a, option_b, option_c, option_d, question_order
            FROM poll_questions
            WHERE weekly_poll_id = $1
            ORDER BY question_order
        `, [weeklyPoll.id]);
        
        const clientIp = req.headers['x-forwarded-for']?.split(',')[0] || 
                        req.connection?.remoteAddress || 
                        req.socket?.remoteAddress || 
                        'unknown';
        
        // Check which questions user has already answered
        const answeredResult = await pool.query(`
            SELECT question_id, selected_option
            FROM poll_responses
            WHERE weekly_poll_id = $1 AND ip_address = $2
        `, [weeklyPoll.id, clientIp]);
        
        const answeredMap = new Map();
        answeredResult.rows.forEach(row => {
            answeredMap.set(row.question_id, row.selected_option);
        });
        
        // Prepare questions with answer status
        const questions = questionsResult.rows.map(q => ({
            id: q.id,
            question: q.question,
            options: {
                A: q.option_a,
                B: q.option_b,
                C: q.option_c,
                D: q.option_d
            },
            answered: answeredMap.has(q.id),
            userAnswer: answeredMap.get(q.id) || null
        }));
        
        const allAnswered = questions.every(q => q.answered);
        
        res.json({
            success: true,
            data: {
                pollId: weeklyPoll.id,
                weekNumber: weeklyPoll.week_number,
                year: weeklyPoll.year,
                endDate: weeklyPoll.end_date,
                questions,
                allAnswered,
                totalQuestions: questions.length
            }
        });
    } catch (error) {
        console.error('Error fetching weekly poll:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

// Submit answer for a question
router.post('/weekly/:pollId/answer', async (req, res) => {
    try {
        const pollId = parseInt(req.params.pollId);
        const { questionId, option } = req.body;
        
        if (!questionId || !option || !['A', 'B', 'C', 'D'].includes(option)) {
            return res.status(400).json({ success: false, error: 'Invalid request' });
        }
        
        const clientIp = req.headers['x-forwarded-for']?.split(',')[0] || 
                        req.connection?.remoteAddress || 
                        req.socket?.remoteAddress || 
                        'unknown';
        const userAgent = req.headers['user-agent'] || 'unknown';
        
        // Check if already answered this question
        const existingAnswer = await pool.query(
            'SELECT id FROM poll_responses WHERE weekly_poll_id = $1 AND question_id = $2 AND ip_address = $3',
            [pollId, questionId, clientIp]
        );
        
        if (existingAnswer.rows.length > 0) {
            return res.status(400).json({ success: false, error: 'Already answered this question' });
        }
        
        // Insert answer
        await pool.query(
            'INSERT INTO poll_responses (weekly_poll_id, question_id, selected_option, ip_address, user_agent) VALUES ($1, $2, $3, $4, $5)',
            [pollId, questionId, option, clientIp, userAgent]
        );
        
        res.json({ success: true, message: 'Answer recorded' });
    } catch (error) {
        console.error('Error submitting answer:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

// Get poll results (after completing all questions)
router.get('/weekly/:pollId/results', async (req, res) => {
    try {
        const pollId = parseInt(req.params.pollId);
        
        const results = await pool.query(`
            SELECT 
                q.id as question_id,
                q.question,
                q.question_order,
                COUNT(CASE WHEN r.selected_option = 'A' THEN 1 END) as option_a_count,
                COUNT(CASE WHEN r.selected_option = 'B' THEN 1 END) as option_b_count,
                COUNT(CASE WHEN r.selected_option = 'C' THEN 1 END) as option_c_count,
                COUNT(CASE WHEN r.selected_option = 'D' THEN 1 END) as option_d_count,
                COUNT(r.id) as total_responses
            FROM poll_questions q
            LEFT JOIN poll_responses r ON r.question_id = q.id AND r.weekly_poll_id = $1
            WHERE q.weekly_poll_id = $1
            GROUP BY q.id, q.question, q.question_order
            ORDER BY q.question_order
        `, [pollId]);
        
        res.json({ success: true, data: results.rows });
    } catch (error) {
        console.error('Error fetching results:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

module.exports = router;
