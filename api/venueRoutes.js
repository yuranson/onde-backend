const express = require('express');
const router = express.Router();
const db = require('../initDB');

// Utility: Validate required fields (excluding address for flexibility)
const validateVenue = (data) => {
  const { name, latitude, longitude, province_id, city_id, category } = data;
  if (!name || latitude == null || longitude == null || !province_id || !city_id || !category) {
    return 'All fields (name, latitude, longitude, province_id, city_id, category) are required.';
  }
  return null;
};

// GET all venues
router.get('/', (req, res) => {
  try {
    const venues = db.prepare(`
      SELECT v.*, 
             p.name AS province_name, 
             c.name AS city_name
      FROM venues v
      LEFT JOIN provinces p ON v.province_id = p.id
      LEFT JOIN cities c ON v.city_id = c.id
      ORDER BY v.id DESC
    `).all();

    res.status(200).json({ success: true, data: venues });
  } catch (err) {
    console.error('Error fetching venues:', err);
    res.status(500).json({ success: false, error: 'Failed to fetch venues' });
  }
});

// POST new venue
router.post('/', (req, res) => {
  const error = validateVenue(req.body);
  if (error) return res.status(400).json({ success: false, error });

  const { name, latitude, longitude, address, province_id, city_id, category } = req.body;

  if (!address) {
    return res.status(400).json({ success: false, error: 'Address is required.' });
  }

  try {
    const stmt = db.prepare(`
      INSERT INTO venues (name, latitude, longitude, address, province_id, city_id, category)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `);
    const result = stmt.run(name, latitude, longitude, address, province_id, city_id, category);
    res.status(201).json({ success: true, id: result.lastInsertRowid });
  } catch (err) {
    console.error('Error creating venue:', err);
    res.status(500).json({ success: false, error: 'Failed to create venue' });
  }
});

// PUT update venue
router.put('/:id', (req, res) => {
  const id = Number(req.params.id);
  if (isNaN(id)) {
    return res.status(400).json({ success: false, error: 'Invalid venue ID' });
  }

  const error = validateVenue(req.body);
  if (error) return res.status(400).json({ success: false, error });

  const { name, latitude, longitude, address, province_id, city_id, category } = req.body;

  if (!address) {
    return res.status(400).json({ success: false, error: 'Address is required.' });
  }

  try {
    const stmt = db.prepare(`
      UPDATE venues
      SET name = ?, latitude = ?, longitude = ?, address = ?, province_id = ?, city_id = ?, category = ?
      WHERE id = ?
    `);
    const result = stmt.run(name, latitude, longitude, address, province_id, city_id, category, id);

    if (result.changes === 0) {
      return res.status(404).json({ success: false, error: 'Venue not found or not updated' });
    }

    res.json({ success: true, message: 'Venue updated' });
  } catch (err) {
    console.error('Error updating venue:', err);
    res.status(500).json({ success: false, error: 'Failed to update venue' });
  }
});

// DELETE venue
router.delete('/:id', (req, res) => {
  const id = Number(req.params.id);
  if (isNaN(id)) {
    return res.status(400).json({ success: false, error: 'Invalid venue ID' });
  }

  try {
    const stmt = db.prepare('DELETE FROM venues WHERE id = ?');
    const result = stmt.run(id);

    if (result.changes === 0) {
      return res.status(404).json({ success: false, error: 'Venue not found' });
    }

    res.json({ success: true, message: 'Venue deleted' });
  } catch (err) {
    console.error('Error deleting venue:', err);
    res.status(500).json({ success: false, error: 'Failed to delete venue' });
  }
});

module.exports = router;