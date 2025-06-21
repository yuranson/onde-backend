const express = require("express");
const cors = require("cors");
const path = require("path");

// Inicializa a base de dados SQLite
const db = require("./initDB");

// Importa as rotas
const provinceRoutes = require("./api/provinceRoutes");
const cityRoutes = require("./api/cityRoutes");
const venueRoutes = require("./api/venueRoutes");

const app = express();

// Middlewares globais
app.use(cors());
app.use(express.json());

// Rotas da API
app.use("/api/provinces", provinceRoutes);
app.use("/api/cities", cityRoutes);
app.use("/api/venues", venueRoutes);

// Porta de escuta (compatível com Render ou localhost)
const PORT = process.env.PORT || 3001;

app.listen(PORT, "0.0.0.0", () => {
  console.log(`✅ Servidor rodando em http://localhost:${PORT}`);
});
console.log('🔍 Verificando db:', db);
