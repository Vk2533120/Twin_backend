const { Pool } = require('pg');
require('dotenv').config();

console.log("=== CONNECTION TRACKER ===");
console.log("Is DATABASE_URL found?", !!process.env.DATABASE_URL);
console.log("Is local DB_HOST found?", !!process.env.DB_HOST);
console.log("==========================");

let poolConfig;

// If we have a Railway URL, ONLY use that string
if (process.env.DATABASE_URL) {
  poolConfig = {
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false } // Required for secure cloud connections
  };
} 
// Otherwise, use the local variables
else {
  poolConfig = {
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_DATABASE,
    // Safely parse the password to a string to prevent the SASL crash
    password: process.env.DB_PASSWORD ? String(process.env.DB_PASSWORD) : undefined,
    port: process.env.DB_PORT,
  };
}

const pool = new Pool(poolConfig);

pool.on('connect', () => {
  // Silent success
});

pool.on('error', (err) => {
  console.error('Unexpected error on idle PostgreSQL client:', err);
  process.exit(-1);
});

// BULLETPROOF EXPORT: Covers every possible way your app might import it
module.exports = {
  query: (text, params) => pool.query(text, params),
  pool: pool
};