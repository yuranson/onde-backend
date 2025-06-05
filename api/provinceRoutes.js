const express = require('express');
const router = express.Router();
const db = require('../initDB');

router.get('/', (req, res) => {
  try {
    const provinces = db.prepare('SELECT * FROM provinces ORDER BY name ASC').all();
    res.json({ success: true, data: provinces });
  } catch (err) {
    console.error('Failed to fetch provinces:', err);
    res.status(500).json({ success: false, error: 'Internal Server Error' });
  }
});

module.exports = router;