const express = require("express");
const cors = require("cors");
const path = require("path");

const db = require("./initDB");

const provinceRoutes = require("./api/provinceRoutes");
const cityRoutes = require("./api/cityRoutes");
const venueRoutes = require("./api/venueRoutes");

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/provinces", provinceRoutes);
app.use("/api/cities", cityRoutes);
app.use("/api/venues", venueRoutes);

const PORT = process.env.PORT || 3001;
app.listen(PORT, "0.0.0.0", () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});