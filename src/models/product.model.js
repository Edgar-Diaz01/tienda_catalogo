const fs = require("fs").promises;
const path = require("path");

const filePath = path.join(__dirname, "..", "..", "data", "products.json");

class Product {
  static async getAll() {
    const data = await fs.readFile(filePath, "utf-8");
    return JSON.parse(data);
  }

  static async getCategories() {
    const products = await Product.getAll();
    const cats = [...new Set(products.map(p => p.category).filter(Boolean))];
    cats.sort((a, b) => a.localeCompare(b));
    return cats;
  }
}

module.exports = Product;
