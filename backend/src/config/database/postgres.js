const { Pool } = require('pg');

// Create a connection pool using DATABASE_URL
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 10000,  
  ssl: process.env.NODE_ENV === 'production' 
    ? { rejectUnauthorized: false } 
    : false,
});

// Test connection
pool.connect((err, client, release) => {
  if (err) {
    console.log('⚠️ PostgreSQL connection error:', err.message);
  } else {
    console.log('✅ PostgreSQL connected');
    release();
  }
});

// Query helper
const query = async (text, params) => {
  try {
    const start = Date.now();
    const res = await pool.query(text, params);
    const duration = Date.now() - start;
    if (duration > 100) {
      console.log('Slow query:', { text, duration });
    }
    return res;
  } catch (error) {
    console.error('Database query error:', error.message);
    throw error;
  }
};

// Transaction helper
const transaction = async (callback) => {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const result = await callback(client);
    await client.query('COMMIT');
    return result;
  } catch (e) {
    await client.query('ROLLBACK');
    throw e;
  } finally {
    client.release();
  }
};

module.exports = { query, transaction, pool };