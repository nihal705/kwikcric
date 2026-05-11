// backend/src/router/v1/quizRoutes.js

const express = require('express');
const router = express.Router();
const pool = require('../../config/database');

// ==================== MIDDLEWARE ====================
// Authentication middleware (implement based on your auth system)
const authenticateUser = async (req, res, next) => {
    try {
        // Get user ID from JWT token or session
        // Example: const userId = req.user.id;
        const userId = req.headers['user-id'] || 1; // Temporary for testing
        
        if (!userId) {
            return res.status(401).json({ 
                success: false, 
                error: 'User not authenticated' 
            });
        }
        
        req.userId = userId;
        next();
    } catch (error) {
        res.status(401).json({ success: false, error: 'Authentication failed' });
    }
};

// Validation middleware
const validateGameResult = (req, res, next) => {
    const { userId, gameType, category, difficulty, score, totalQuestions, correctAnswers } = req.body;
    
    const errors = [];
    if (!userId) errors.push('userId is required');
    if (!gameType) errors.push('gameType is required');
    if (score === undefined) errors.push('score is required');
    if (!totalQuestions) errors.push('totalQuestions is required');
    if (correctAnswers === undefined) errors.push('correctAnswers is required');
    
    if (errors.length > 0) {
        return res.status(400).json({ 
            success: false, 
            error: 'Validation failed', 
            details: errors 
        });
    }
    
    next();
};

// ==================== QUESTION ENDPOINTS ====================

/**
 * GET /api/v1/quiz/questions/random
 * Get random questions for quiz game
 * Query params:
 * - category: string (optional)
 * - difficulty: string (optional: easy, medium, hard)
 * - count: number (default: 10, max: 50)
 * - excludeIds: string (comma-separated IDs to exclude)
 */
router.get('/questions/random', async (req, res) => {
    try {
        const { 
            category, 
            difficulty, 
            count = 10, 
            excludeIds = '' 
        } = req.query;
        
        // Validate count
        const questionCount = Math.min(Math.max(parseInt(count) || 10, 1), 50);
        
        // Build query
        let query = `
            SELECT 
                q.id,
                q.sub_category as "subCategory",
                q.difficulty,
                q.question_type as "questionType",
                q.question_text as "text",
                q.options,
                q.correct_answer as "correctAnswer",
                q.explanation,
                q.points,
                q.hint,
                c.name as category
            FROM quiz_questions q
            JOIN quiz_categories c ON q.category_id = c.id
            WHERE 1=1
        `;
        
        const params = [];
        
        // Filter by category
        if (category && category !== 'All-Mode') {
            params.push(category);
            query += ` AND c.name = $${params.length}`;
        }
        
        // Filter by difficulty
        if (difficulty && difficulty !== 'all') {
            params.push(difficulty);
            query += ` AND q.difficulty = $${params.length}`;
        }
        
        // Exclude specific question IDs (for lifelines when user has already seen questions)
        if (excludeIds) {
            const excludeIdArray = excludeIds.split(',').map(id => parseInt(id)).filter(id => !isNaN(id));
            if (excludeIdArray.length > 0) {
                params.push(excludeIdArray);
                query += ` AND q.id != ALL($${params.length}::int[])`;
            }
        }
        
        // Get random questions
        query += ` ORDER BY RANDOM() LIMIT $${params.length + 1}`;
        params.push(questionCount);
        
        const result = await pool.query(query, params);
        
        // Parse JSON options if needed
        const questions = result.rows.map(q => ({
            ...q,
            options: typeof q.options === 'string' ? JSON.parse(q.options) : q.options
        }));
        
        res.json({
            success: true,
            questions,
            total: questions.length,
            requestedCount: questionCount
        });
        
    } catch (error) {
        console.error('Error fetching random questions:', error);
        res.status(500).json({ 
            success: false, 
            error: 'Failed to fetch questions',
            details: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
});

/**
 * POST /api/v1/quiz/questions/by-ids
 * Get specific questions by their IDs
 * Body: { questionIds: number[] }
 */
router.post('/questions/by-ids', async (req, res) => {
    try {
        const { questionIds } = req.body;
        
        if (!questionIds || !Array.isArray(questionIds) || questionIds.length === 0) {
            return res.status(400).json({
                success: false,
                error: 'questionIds array is required'
            });
        }
        
        // Limit to 100 questions per request
        if (questionIds.length > 100) {
            return res.status(400).json({
                success: false,
                error: 'Maximum 100 questions per request'
            });
        }
        
        const query = `
            SELECT 
                q.id,
                q.sub_category as "subCategory",
                q.difficulty,
                q.question_type as "questionType",
                q.question_text as "text",
                q.options,
                q.correct_answer as "correctAnswer",
                q.explanation,
                q.points,
                q.hint,
                c.name as category
            FROM quiz_questions q
            JOIN quiz_categories c ON q.category_id = c.id
            WHERE q.id = ANY($1::int[])
            ORDER BY q.id
        `;
        
        const result = await pool.query(query, [questionIds]);
        
        const questions = result.rows.map(q => ({
            ...q,
            options: typeof q.options === 'string' ? JSON.parse(q.options) : q.options
        }));
        
        res.json({
            success: true,
            questions,
            total: questions.length
        });
        
    } catch (error) {
        console.error('Error fetching questions by IDs:', error);
        res.status(500).json({ 
            success: false, 
            error: 'Failed to fetch questions'
        });
    }
});

/**
 * GET /api/v1/quiz/categories
 * Get all quiz categories with question counts
 */
router.get('/categories', async (req, res) => {
    try {
        const query = `
            SELECT 
                c.id,
                c.name as category,
                c.description,
                COUNT(q.id) as question_count,
                COUNT(CASE WHEN q.difficulty = 'easy' THEN 1 END) as easy_count,
                COUNT(CASE WHEN q.difficulty = 'medium' THEN 1 END) as medium_count,
                COUNT(CASE WHEN q.difficulty = 'hard' THEN 1 END) as hard_count
            FROM quiz_categories c
            LEFT JOIN quiz_questions q ON q.category_id = c.id
            GROUP BY c.id, c.name, c.description
            ORDER BY c.name
        `;
        
        const result = await pool.query(query);
        
        // Add "All-Mode" as virtual category
        const allModeCount = result.rows.reduce((sum, cat) => sum + parseInt(cat.question_count), 0);
        
        res.json({
            success: true,
            categories: [
                {
                    id: 0,
                    category: 'All-Mode',
                    description: 'All cricket categories combined',
                    question_count: allModeCount,
                    easy_count: result.rows.reduce((sum, cat) => sum + parseInt(cat.easy_count), 0),
                    medium_count: result.rows.reduce((sum, cat) => sum + parseInt(cat.medium_count), 0),
                    hard_count: result.rows.reduce((sum, cat) => sum + parseInt(cat.hard_count), 0)
                },
                ...result.rows
            ]
        });
        
    } catch (error) {
        console.error('Error fetching categories:', error);
        res.status(500).json({ 
            success: false, 
            error: 'Failed to fetch categories'
        });
    }
});

/**
 * GET /api/v1/quiz/stats
 * Get overall quiz statistics
 */
router.get('/stats', async (req, res) => {
    try {
        const query = `
            SELECT 
                COUNT(*) as total_questions,
                COUNT(DISTINCT category_id) as total_categories,
                COUNT(CASE WHEN difficulty = 'easy' THEN 1 END) as easy_questions,
                COUNT(CASE WHEN difficulty = 'medium' THEN 1 END) as medium_questions,
                COUNT(CASE WHEN difficulty = 'hard' THEN 1 END) as hard_questions,
                SUM(points) as total_points_available
            FROM quiz_questions
        `;
        
        const result = await pool.query(query);
        
        res.json({
            success: true,
            stats: result.rows[0]
        });
        
    } catch (error) {
        console.error('Error fetching stats:', error);
        res.status(500).json({ 
            success: false, 
            error: 'Failed to fetch stats'
        });
    }
});

// ==================== GAME HISTORY ENDPOINTS ====================

/**
 * POST /api/v1/quiz/game-history
 * Save game result to history
 */
router.post('/game-history', validateGameResult, async (req, res) => {
    try {
        const {
            userId,
            gameType,
            category,
            difficulty,
            score,
            totalQuestions,
            correctAnswers,
            timeTaken = 0,
            metadata = {}
        } = req.body;
        
        const query = `
            INSERT INTO game_history 
            (user_id, game_type, category, difficulty, score, total_questions, 
             correct_answers, time_taken, metadata, played_at)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, NOW())
            RETURNING id, played_at
        `;
        
        const result = await pool.query(query, [
            userId,
            gameType,
            category,
            difficulty,
            score,
            totalQuestions,
            correctAnswers,
            timeTaken,
            JSON.stringify(metadata)
        ]);
        
        // Calculate accuracy percentage
        const accuracy = ((correctAnswers / totalQuestions) * 100).toFixed(2);
        
        res.json({
            success: true,
            message: 'Game result saved successfully',
            history: {
                id: result.rows[0].id,
                playedAt: result.rows[0].played_at,
                score,
                accuracy: `${accuracy}%`
            }
        });
        
    } catch (error) {
        console.error('Error saving game history:', error);
        res.status(500).json({ 
            success: false, 
            error: 'Failed to save game result'
        });
    }
});

/**
 * GET /api/v1/quiz/game-history/:userId
 * Get user's game history
 * Query params:
 * - limit: number (default: 20, max: 100)
 * - offset: number (default: 0)
 * - gameType: string (optional filter)
 * - category: string (optional filter)
 */
router.get('/game-history/:userId', async (req, res) => {
    try {
        const { userId } = req.params;
        const { 
            limit = 20, 
            offset = 0, 
            gameType, 
            category 
        } = req.query;
        
        // Validate limit
        const resultLimit = Math.min(Math.max(parseInt(limit) || 20, 1), 100);
        const resultOffset = parseInt(offset) || 0;
        
        let query = `
            SELECT 
                id,
                game_type as "gameType",
                category,
                difficulty,
                score,
                total_questions as "totalQuestions",
                correct_answers as "correctAnswers",
                time_taken as "timeTaken",
                metadata,
                played_at as "playedAt",
                ROUND((correct_answers::DECIMAL / total_questions) * 100, 2) as accuracy
            FROM game_history
            WHERE user_id = $1
        `;
        
        const params = [userId];
        let paramCount = 1;
        
        if (gameType) {
            paramCount++;
            query += ` AND game_type = $${paramCount}`;
            params.push(gameType);
        }
        
        if (category && category !== 'All-Mode') {
            paramCount++;
            query += ` AND category = $${paramCount}`;
            params.push(category);
        }
        
        query += ` ORDER BY played_at DESC LIMIT $${paramCount + 1} OFFSET $${paramCount + 2}`;
        params.push(resultLimit, resultOffset);
        
        const result = await pool.query(query, params);
        
        // Get total count for pagination
        let countQuery = `SELECT COUNT(*) as total FROM game_history WHERE user_id = $1`;
        const countParams = [userId];
        
        if (gameType) {
            countQuery += ` AND game_type = $2`;
            countParams.push(gameType);
        }
        
        if (category && category !== 'All-Mode') {
            countQuery += ` AND category = $${countParams.length + 1}`;
            countParams.push(category);
        }
        
        const countResult = await pool.query(countQuery, countParams);
        
        // Calculate summary stats
        const summaryQuery = `
            SELECT 
                COUNT(*) as total_games,
                SUM(score) as total_score,
                AVG(score) as avg_score,
                SUM(correct_answers) as total_correct,
                SUM(total_questions) as total_questions_attempted,
                MAX(score) as high_score,
                AVG(time_taken) as avg_time
            FROM game_history
            WHERE user_id = $1
        `;
        
        const summaryResult = await pool.query(summaryQuery, [userId]);
        
        res.json({
            success: true,
            history: result.rows,
            pagination: {
                total: parseInt(countResult.rows[0].total),
                limit: resultLimit,
                offset: resultOffset,
                hasMore: (resultOffset + resultLimit) < parseInt(countResult.rows[0].total)
            },
            summary: summaryResult.rows[0]
        });
        
    } catch (error) {
        console.error('Error fetching game history:', error);
        res.status(500).json({ 
            success: false, 
            error: 'Failed to fetch game history'
        });
    }
});

/**
 * GET /api/v1/quiz/game-history/:userId/leaderboard
 * Get leaderboard for a specific game type
 * Query params:
 * - gameType: string (required)
 * - category: string (optional)
 * - limit: number (default: 10)
 */
router.get('/game-history/:userId/leaderboard', async (req, res) => {
    try {
        const { userId } = req.params;
        const { gameType, category, limit = 10 } = req.query;
        
        if (!gameType) {
            return res.status(400).json({
                success: false,
                error: 'gameType is required'
            });
        }
        
        const resultLimit = Math.min(Math.max(parseInt(limit) || 10, 1), 50);
        
        let query = `
            SELECT 
                u.username,
                u.email,
                MAX(gh.score) as high_score,
                AVG(gh.score) as avg_score,
                COUNT(*) as games_played,
                SUM(gh.correct_answers) as total_correct,
                SUM(gh.total_questions) as total_attempted,
                ROUND(AVG((gh.correct_answers::DECIMAL / gh.total_questions) * 100), 2) as avg_accuracy
            FROM game_history gh
            JOIN users u ON gh.user_id = u.id
            WHERE gh.game_type = $1
        `;
        
        const params = [gameType];
        
        if (category && category !== 'All-Mode') {
            params.push(category);
            query += ` AND gh.category = $${params.length}`;
        }
        
        query += `
            GROUP BY u.id, u.username, u.email
            ORDER BY high_score DESC, avg_accuracy DESC
            LIMIT $${params.length + 1}
        `;
        params.push(resultLimit);
        
        const result = await pool.query(query, params);
        
        // Get current user's rank
        let userRankQuery = `
            WITH ranked_users AS (
                SELECT 
                    u.id,
                    u.username,
                    MAX(gh.score) as high_score,
                    ROW_NUMBER() OVER (ORDER BY MAX(gh.score) DESC, AVG((gh.correct_answers::DECIMAL / gh.total_questions) * 100) DESC) as rank
                FROM game_history gh
                JOIN users u ON gh.user_id = u.id
                WHERE gh.game_type = $1
        `;
        
        const userRankParams = [gameType];
        
        if (category && category !== 'All-Mode') {
            userRankParams.push(category);
            userRankQuery += ` AND gh.category = $${userRankParams.length}`;
        }
        
        userRankQuery += `
                GROUP BY u.id, u.username
            )
            SELECT rank FROM ranked_users WHERE id = $${userRankParams.length + 1}
        `;
        userRankParams.push(parseInt(userId));
        
        const userRankResult = await pool.query(userRankQuery, userRankParams);
        
        res.json({
            success: true,
            leaderboard: result.rows,
            userRank: userRankResult.rows[0]?.rank || null
        });
        
    } catch (error) {
        console.error('Error fetching leaderboard:', error);
        res.status(500).json({ 
            success: false, 
            error: 'Failed to fetch leaderboard'
        });
    }
});

// ==================== ACHIEVEMENTS & STATS ====================

/**
 * GET /api/v1/quiz/user-stats/:userId
 * Get detailed user statistics for quizzes
 */
router.get('/user-stats/:userId', async (req, res) => {
    try {
        const { userId } = req.params;
        
        const query = `
            SELECT 
                COUNT(*) as total_games_played,
                SUM(score) as total_points,
                AVG(score) as average_score,
                SUM(correct_answers) as total_correct_answers,
                SUM(total_questions) as total_questions_attempted,
                MAX(score) as highest_score,
                AVG(time_taken) as average_time_per_game,
                COUNT(DISTINCT category) as categories_played,
                COUNT(DISTINCT game_type) as game_types_played
            FROM game_history
            WHERE user_id = $1
        `;
        
        const result = await pool.query(query, [userId]);
        
        // Get category-wise stats
        const categoryStats = await pool.query(`
            SELECT 
                category,
                COUNT(*) as games_played,
                AVG(score) as avg_score,
                AVG(correct_answers::DECIMAL / total_questions * 100) as avg_accuracy
            FROM game_history
            WHERE user_id = $1
            GROUP BY category
            ORDER BY avg_score DESC
        `, [userId]);
        
        res.json({
            success: true,
            stats: result.rows[0],
            categoryStats: categoryStats.rows
        });
        
    } catch (error) {
        console.error('Error fetching user stats:', error);
        res.status(500).json({ 
            success: false, 
            error: 'Failed to fetch user statistics'
        });
    }
});

module.exports = router;