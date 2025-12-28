const Product = require("../models/product.model");

exports.list = async (req, res) => {
  const selectedCategory = (req.query.category || "all").trim();

  const [products, categories] = await Promise.all([
    Product.getAll(),
    Product.getCategories()
  ]);

  const filteredProducts =
    selectedCategory === "all"
      ? products
      : products.filter(p => p.category === selectedCategory);

  res.render("index", {
    products: filteredProducts,
    categories,
    selectedCategory
  });
};
