require("dotenv").config();
const express = require("express");
const path = require("path");

const productRoutes = require("./routes/product.routes");

const app = express();

// EJS views
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Static files
app.use(express.static(path.join(__dirname, "public")));
app.use("/data", express.static(path.join(__dirname, "..", "data"))); // para servir JSON si quieres

// Routes
app.use("/", productRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor en http://localhost:${PORT}`));
