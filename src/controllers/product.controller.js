const Product = require("../models/product.model");

// LISTA + FILTRO POR CATEGORÍA
exports.list = async (req, res) => {
  const selectedCategory = (req.query.category || "all").trim();

  const [products, categories] = await Promise.all([
    Product.getAll(),
    Product.getCategories(),
  ]);

  const filteredProducts =
    selectedCategory === "all"
      ? products
      : products.filter((p) => p.category === selectedCategory);

  res.render("index", {
    products: filteredProducts,
    categories,
    selectedCategory,
  });
};

// DETALLE DE PRODUCTO
exports.detail = async (req, res) => {
  const { id } = req.params;
  const product = await Product.getById(id);

  if (!product) {
    return res.status(404).send("Producto no encontrado");
    // Si tienes 404.ejs, aquí podemos hacer: return res.status(404).render("404");
  }

  const whatsappNumber = process.env.WHATSAPP_NUMBER || "";
  res.render("product", { product, whatsappNumber });
};
