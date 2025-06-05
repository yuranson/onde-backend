const Database = require('better-sqlite3');
const db = new Database('onde.db');

db.prepare(`
  CREATE TABLE IF NOT EXISTS provinces (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL
  )
`).run();

db.prepare(`
  CREATE TABLE IF NOT EXISTS cities (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    province_id INTEGER,
    FOREIGN KEY (province_id) REFERENCES provinces(id)
  )
`).run();

db.prepare(`
  CREATE TABLE IF NOT EXISTS venues (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    address TEXT NOT NULL,
    latitude REAL,
    longitude REAL,
    province_id INTEGER,
    city_id INTEGER,
    category TEXT,
    FOREIGN KEY (province_id) REFERENCES provinces(id),
    FOREIGN KEY (city_id) REFERENCES cities(id)
  )
`).run();

const existingProvinces = db.prepare(`SELECT COUNT(*) AS count FROM provinces`).get();
if (existingProvinces.count === 0) {
  const insert = db.prepare(`INSERT INTO provinces (name) VALUES (?)`);
  ["Maputo", "Gaza", "Sofala", "Zambezia", "Nampula"].forEach(name => insert.run(name));
  console.log("✅ Provinces seeded.");
}

const existingCities = db.prepare(`SELECT COUNT(*) AS count FROM cities`).get();
if (existingCities.count === 0) {
  const insert = db.prepare(`INSERT INTO cities (name, province_id) VALUES (?, ?)`);
  insert.run("Maputo City", 1);
  insert.run("Xai-Xai", 2);
  insert.run("Beira", 3);
  insert.run("Quelimane", 4);
  insert.run("Nampula City", 5);
  console.log("✅ Cities seeded.");
}

module.exports = db;