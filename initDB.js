const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Resolve path to the SQLite file
const dbPath = path.join(__dirname, 'db.sqlite');

// Open the database
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('❌ Error opening database:', err.message);
  } else {
    console.log('✅ Connected to SQLite database.');
  }
});

// Initialize tables
db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS provinces (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL UNIQUE
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS cities (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      province_id INTEGER,
      FOREIGN KEY(province_id) REFERENCES provinces(id)
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS venues (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      address TEXT NOT NULL,
      province_id INTEGER,
      city_id INTEGER,
      category TEXT,
      FOREIGN KEY(province_id) REFERENCES provinces(id),
      FOREIGN KEY(city_id) REFERENCES cities(id)
    )
  `);
});

module.exports = db;
