require('dotenv').config();
const pool = require('./db');

async function init() {
    try{
        await pool.query(`
            CREATE TABLE IF NOT EXISTS links (
             code VARCHAR(8) PRIMARY KEY,
             target_url TEXT NOT NULL,
             click_count INTEGER NOT NULL DEFAULT 0,
             last_clicked TIMESTAMPTZ,
             created_at TIMESTAMPTZ DEFAULT NOW()
            );
        `);

        console.log('Table created');
    } catch (err) {
        console.error('Error creating table:', err.message);
    } finally {
        await pool.end();
        process.exit(0);
    }
}

init();