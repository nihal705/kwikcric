-- When you're ready to move to database, use this schema
CREATE TABLE quiz_questions (
    id SERIAL PRIMARY KEY,
    category VARCHAR(50),
    sub_category VARCHAR(50),
    difficulty VARCHAR(10),
    type VARCHAR(20),
    question TEXT,
    option_a TEXT,
    option_b TEXT,
    option_c TEXT,
    option_d TEXT,
    correct_answer VARCHAR(255),
    explanation TEXT,
    points INTEGER,
    hint TEXT,
    image_url TEXT,
    audio_url TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for faster queries
CREATE INDEX idx_quiz_category ON quiz_questions(category);
CREATE INDEX idx_quiz_difficulty ON quiz_questions(difficulty);

-- User game sessions table
CREATE TABLE user_game_sessions (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    game_type VARCHAR(50), -- 'kwik_cricket', 'quiz', 'imposter', 'guess_legend', 'cards'
    session_data JSONB,
    score INTEGER,
    status VARCHAR(20), -- 'in_progress', 'completed', 'abandoned'
    started_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_played_at TIMESTAMP,
    completed_at TIMESTAMP,
    UNIQUE(user_id, game_type, status)
);

-- Game history records
CREATE TABLE game_history (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    game_type VARCHAR(50),
    game_mode VARCHAR(50),
    score INTEGER,
    details JSONB,
    played_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Quiz specific stats
CREATE TABLE quiz_history (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    mode VARCHAR(20), -- 'quick', 'challenge', 'filltable'
    category VARCHAR(50),
    difficulty VARCHAR(20),
    score INTEGER,
    total_questions INTEGER,
    correct_answers INTEGER,
    accuracy INTEGER,
    max_streak INTEGER,
    time_spent INTEGER,
    played_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

