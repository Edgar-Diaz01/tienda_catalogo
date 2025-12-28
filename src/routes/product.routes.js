const router = require("express").Router();
const productController = require("../controllers/product.controller");

router.get("/", productController.list);
router.get("/producto/:id", productController.detail);

module.exports = router;

