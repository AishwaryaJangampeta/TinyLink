require('dotenv').config();
const express = require('express');
const cors = require('cors');
const pool = require('./db');
const linkRouter = require('./routes/links');

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

app.get('/healthz', async(req, res) =>{
    try{
        await pool.query('SELECT 1');
        res.status(200).json({ ok: true, version: 1.0, db: 'ok'});
    }catch (err) {
        console.error('Health check failed:', err.message);
        res.status(500).json({ ok: false, version: '1.0', db: 'down'});
    }
});

app.use('/api/links', linkRouter);

app.get('/:code', async (req, res) => {
  const { code } = req.params;

  try {
    const result = await pool.query(
      'SELECT target_url FROM links WHERE code = $1',
      [code]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Code not found' });
    }

    const targetUrl = result.rows[0].target_url;

    pool.query(
      `UPDATE links
       SET click_count = click_count + 1,
        last_clicked = NOW()
       WHERE code = $1`,
      [code]
    ).catch(err => console.error('Tracking update failed:', err.message));

    return res.redirect(302, targetUrl);
  } catch (err) {
    console.error('Redirect error:', err.message);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});