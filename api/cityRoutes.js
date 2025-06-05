const express = require("express");
const router = express.Router();
const db = require("../initDB");

router.get("/", (req, res) => {
  try {
    const cities = db.prepare("SELECT * FROM cities ORDER BY name ASC").all();
    res.json({ success: true, data: cities });
  } catch (err) {
    console.error("Error fetching cities:", err);
    res.status(500).json({ success: false, error: "Failed to fetch cities" });
  }
});

router.get("/by-province/:provinceId", (req, res) => {
  const provinceId = Number(req.params.provinceId);

  if (isNaN(provinceId)) {
    return res.status(400).json({ success: false, error: "Invalid province ID" });
  }

  try {
    const cities = db
      .prepare("SELECT * FROM cities WHERE province_id = ? ORDER BY name ASC")
      .all(provinceId);

    res.json({ success: true, data: cities });
  } catch (err) {
    console.error("Error fetching cities by province:", err);
    res.status(500).json({ success: false, error: "Failed to fetch cities by province" });
  }
});

module.exports = router;