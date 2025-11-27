const express = require('express');
const router = express.Router();
const pool = require('../db');

const CODE_REGEX = /^[A-Za-z0-9]{6,8}$/;

function generateCode(length = 6) {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for(let i = 0; i < length; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
}

router.post('/', async(req, res) => {
    const { url, code } = req.body;

    if(!url) {
        return res.status(400).json({ error: 'URL is required' });
    }

    try {
        new URL(url);
    }catch (err) {
        return res.status(400).json({ error: 'Invalid URL format '});
    }

    let finalCode = code;

    if (finalCode !== undefined && finalCode !== null && finalCode !== '') {
        if(!CODE_REGEX.test(finalCode)) {
            return res.status(400).json({
                error: 'Code must be 6-8 characters, only letters and numbers',
            });
        }
    }else {
        finalCode = generateCode(6);
    }

    try {
        const insertQuery = `
          INSERT INTO links (code, target_url)
          VALUES ($1, $2)
          RETURNING code, target_url, click_count, last_clicked, created_at
        `;

         const result = await pool.query(insertQuery, [finalCode, url]);
         const row = result.rows[0];

         return res.status(201).json({
            code: row.code,
            target_url: row.target_url,
            click_count: row.click_count,
            last_clicked: row.last_clicked,
            created_at: row.created_at,
         });
    } catch (err) {
        if (err.code === '23505') {
            return res.status(409).json({ error: 'Code already exists, choose another one' });
        }

        console.error('Error inserting link:', err.message);
        return res.json({ message: 'URL and code successfully', url, code: finalCode,});
    }
});

router.get('/', async(req, res) => {
    try {
        const result = await pool.query(`
            SELECT code, target_url, click_count, last_clicked, created_at
            FROM links
            ORDER BY created_at DESC
        `);
        return res.json(result.rows);
    } catch (err) {
        console.error('Error fetching links:', err.message);
        return res.status(500).json({ error: 'Internal server error' });
    }
});

router.get('/:code', async(req, res) => {
    const { code } = req.params;
    
    try {
        const result = await pool.query(
            `SELECT code, target_url, click_count, last_clicked, created_at
            FROM links
            WHERE code = $1`,
            [code]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Code not found' });
        }
        return res.json(result.rows[0]);
    }catch (err) {
        console.error('Error fetching link:', err.message);
        return res.status(500).json({ error: 'Internal server error' });
    }
});

router.delete('/:code', async (req, res) => {
  const { code } = req.params;
  try {
    const result = await pool.query(
      'DELETE FROM links WHERE code = $1 RETURNING code',
      [code]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'Code not found' });
    }
    return res.status(204).send();
  } catch (err) {
    console.error('Error deleting link:', err.message);
    return res.status(500).json({ error: 'Internal server error' });
  }
});


module.exports = router;