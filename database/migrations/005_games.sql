-- ============================================================================
-- MIGRATION 005: Games & Quizzes
-- ============================================================================

BEGIN;

-- Create game_sessions table
CREATE TABLE IF NOT EXISTS game_sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    game_type VARCHAR(30) NOT NULL,
    score INT DEFAULT 0,
    level INT DEFAULT 1,
    metadata JSONB DEFAULT '{}'::jsonb,
    started_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    ended_at TIMESTAMP,
    duration_seconds INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create quiz_questions table
CREATE TABLE IF NOT EXISTS quiz_questions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    category VARCHAR(50),
    sub_category VARCHAR(50),
    difficulty VARCHAR(20),
    question_text TEXT NOT NULL,
    options JSONB NOT NULL,
    correct_answer VARCHAR(255) NOT NULL,
    explanation TEXT,
    points INT DEFAULT 10,
    time_limit_seconds INT DEFAULT 30,
    player_id UUID REFERENCES players(id),
    tournament_id UUID REFERENCES tournaments(id),
    match_id UUID REFERENCES matches(id),
    year INT,
    image_url TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create quiz_attempts table
CREATE TABLE IF NOT EXISTS quiz_attempts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    questions_answered JSONB,
    score INT,
    total_questions INT,
    correct_answers INT,
    wrong_answers INT,
    time_taken_seconds INT,
    category VARCHAR(50),
    difficulty VARCHAR(20),
    completed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create leaderboards table
CREATE TABLE IF NOT EXISTS leaderboards (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    leaderboard_type VARCHAR(30),
    game_type VARCHAR(30),
    user_id UUID NOT NULL REFERENCES users(id),
    score INT,
    rank INT,
    metadata JSONB,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(leaderboard_type, game_type, user_id)
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_game_sessions_user ON game_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_game_sessions_type ON game_sessions(game_type);
CREATE INDEX IF NOT EXISTS idx_quiz_questions_category ON quiz_questions(category);
CREATE INDEX IF NOT EXISTS idx_quiz_attempts_user ON quiz_attempts(user_id);
CREATE INDEX IF NOT EXISTS idx_leaderboards_score ON leaderboards(score DESC);

COMMIT;