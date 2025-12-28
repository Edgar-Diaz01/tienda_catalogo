const path = require("path");

function parseCSV(csvText) {
  const rows = [];
  let row = [];
  let cur = "";
  let inQuotes = false;

  for (let i = 0; i < csvText.length; i++) {
    const ch = csvText[i];
    const next = csvText[i + 1];

    if (ch === '"' && inQuotes && next === '"') {
      cur += '"';
      i++;
      continue;
    }
    if (ch === '"') {
      inQuotes = !inQuotes;
      continue;
    }
    if (ch === "," && !inQuotes) {
      row.push(cur);
      cur = "";
      continue;
    }
    if ((ch === "\n" || ch === "\r") && !inQuotes) {
      if (cur.length || row.length) {
        row.push(cur);
        rows.push(row);
      }
      cur = "";
      row = [];
      if (ch === "\r" && next === "\n") i++;
      continue;
    }
    cur += ch;
  }
  if (cur.length || row.length) {
    row.push(cur);
    rows.push(row);
  }

  return rows;
}

function toNumberSafe(v) {
  const n = Number(String(v).replace(",", "."));
  return Number.isFinite(n) ? n : 0;
}

class Product {
  static cache = { at: 0, data: [] };
  static CACHE_MS = 60_000; // 1 minuto

  static async getAll() {
    const url = process.env.SHEET_CSV_URL;

    if (!url) {
      console.error("Falta SHEET_CSV_URL en variables de entorno.");
      return [];
    }

    const now = Date.now();
    if (now - Product.cache.at < Product.CACHE_MS) {
      return Product.cache.data;
    }

    const res = await fetch(url);
    if (!res.ok) {
      console.error("No se pudo leer CSV de Sheets:", res.status, res.statusText);
      return [];
    }

    const csv = await res.text();
    const table = parseCSV(csv);

    const headers = (table.shift() || []).map(h => h.trim());
    const idx = (name) => headers.indexOf(name);

    const products = table
      .filter(r => r.some(cell => String(cell || "").trim() !== ""))
      .map(r => ({
        id: r[idx("id")]?.trim(),
        name: r[idx("name")]?.trim(),
        price: toNumberSafe(r[idx("price")]),
        category: r[idx("category")]?.trim(),
        description: r[idx("description")]?.trim(),

        // 🔹 AQUÍ ESTÁ LA INTEGRACIÓN CORRECTA
        image_url: r[idx("image_url")]?.trim() || ""
      }))
      .filter(p => p.name && p.category);

    Product.cache = { at: now, data: products };
    return products;
  }

  static async getCategories() {
    const products = await Product.getAll();
    const cats = [...new Set(products.map(p => p.category).filter(Boolean))];
    cats.sort((a, b) => a.localeCompare(b));
    return cats;
  }
}

module.exports = Product;
