const express = require("express");
const router = express.Router();

const productController = require("../controllers/product.controller");

// Catálogo
router.get("/", productController.list);

// Detalle del producto
router.get("/producto/:id", productController.detail);

module.exports = router;
