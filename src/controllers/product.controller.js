const Product = require("../models/product.model");

/* =========================
   LISTADO / CATÁLOGO
========================= */
exports.list = async (req, res) => {
  try {
    const selectedCategory = (req.query.category || "all").trim();
    const q = (req.query.q || "").trim().toLowerCase();

    const [products, categories] = await Promise.all([
      Product.getAll(),
      Product.getCategories(),
    ]);

    let filtered = products;

    // Filtro por categoría
    if (selectedCategory !== "all") {
      filtered = filtered.filter(
        p => (p.category || "") === selectedCategory
      );
    }

    // Búsqueda por nombre / descripción
    if (q) {
      filtered = filtered.filter(p => {
        const name = (p.name || "").toLowerCase();
        const desc = (p.description || "").toLowerCase();
        return name.includes(q) || desc.includes(q);
      });
    }

    res.render("index", {
      products: filtered,
      categories,
      selectedCategory,
      q,
    });
  } catch (err) {
    console.error("Error en controller list:", err);
    res.status(500).send("Error cargando productos");
  }
};

/* =========================
   DETALLE DEL PRODUCTO
========================= */
exports.detail = async (req, res) => {
  try {
    const id = String(req.params.id);

    const products = await Product.getAll();

    const product = products.find(p => String(p.id) === id);

    if (!product) {
      return res.status(404).render("404", {
        message: "Producto no encontrado",
      });
    }

    // 👇 USA EL NOMBRE REAL DE TU VISTA
    res.render("product", {
      product,
      whatsappNumber: process.env.WHATSAPP_NUMBER || "",
    });

  } catch (err) {
    console.error("Error en detalle de producto:", err);
    res.status(500).send("Error al cargar el producto");
  }
};
