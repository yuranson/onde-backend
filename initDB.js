const Database = require('better-sqlite3');
const path = require('path');

// Caminho absoluto para o arquivo SQLite
const dbPath = path.join(__dirname, 'db.sqlite');

let db;

try {
  db = new Database(dbPath);
  console.log('✅ Conectado ao banco de dados:', dbPath);
} catch (err) {
  console.error('❌ Erro ao conectar ao banco de dados:', err.message);
  process.exit(1);
}

// Inicializar tabelas
try {
  db.exec(`
    CREATE TABLE IF NOT EXISTS provinces (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL UNIQUE
    );

    CREATE TABLE IF NOT EXISTS cities (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      province_id INTEGER,
      FOREIGN KEY(province_id) REFERENCES provinces(id)
    );

    CREATE TABLE IF NOT EXISTS venues (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      address TEXT NOT NULL,
      province_id INTEGER,
      city_id INTEGER,
      category TEXT,
      FOREIGN KEY(province_id) REFERENCES provinces(id),
      FOREIGN KEY(city_id) REFERENCES cities(id)
    );
  `);
  console.log('✅ Tabelas inicializadas');
} catch (err) {
  console.error('❌ Erro ao inicializar tabelas:', err.message);
  process.exit(1);
}

module.exports = db;

