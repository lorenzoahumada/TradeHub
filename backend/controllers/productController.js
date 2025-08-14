const pool = require('../db');

const getProducts = async (req, res) => {
  try {
    const [products] = await pool.query(`
      SELECT products.*, users.name AS owner_name
      FROM products
      JOIN users ON products.owner_id = users.id
      ORDER BY products.id DESC
    `);

    for (let product of products) {
      const [cats] = await pool.query(`
        SELECT c.id, c.name 
        FROM categories c
        JOIN product_categories pc ON c.id = pc.category_id
        WHERE pc.product_id = ?`,
        [product.id]
      );
      product.categories = cats;
    }

    res.json(products);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al obtener productos' });
  }
};


const getProductById = async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM products WHERE id = ?', [req.params.id]);
    if (rows.length === 0) return res.status(404).json({ error: 'Producto no encontrado' });
    
    const product = rows[0];
    // Si tenés imágenes separadas, también consultalas acá
    res.json(product);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al obtener producto' });
  }
};

const getMyProducts = async (req, res) => {
  const userId = req.user.id; // asegurate que esté seteado desde el middleware
  const [rows] = await pool.query('SELECT * FROM products WHERE owner_id = ?', [userId]);
  res.json(rows);
};

const createProduct = async (req, res) => {
  const { name, price, description, brand, categories, newCategories, images } = req.body;
  const userId = req.user.id;

  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();

    // Insertar producto
    const [result] = await conn.query(
      'INSERT INTO products (name, price, description, brand, images, owner_id) VALUES (?, ?, ?, ?, ?, ?)',
      [name, price, description, brand, JSON.stringify(images), userId]
    );
    const productId = result.insertId;

    // Insertar nuevas categorías si existen
    let newCategoryIds = [];
    if (newCategories && newCategories.length > 0) {
      for (const catName of newCategories) {
        const [resCat] = await conn.query(
          'INSERT INTO categories (name) VALUES (?)',
          [catName]
        );
        newCategoryIds.push(resCat.insertId);
      }
    }

    // Unir categorías existentes + nuevas
    const allCategoryIds = [
      ...(categories || []),
      ...newCategoryIds
    ];

    // Insertar relaciones producto-categoría
    if (allCategoryIds.length > 0) {
      const values = allCategoryIds.map(catId => [productId, catId]);
      await conn.query(
        'INSERT INTO product_categories (product_id, category_id) VALUES ?',
        [values]
      );
    }

    await conn.commit();

    res.status(201).json({ id: productId, name, price, description, brand, images });
  } catch (err) {
    await conn.rollback();
    console.error(err);
    res.status(500).json({ error: 'Error al crear el producto' });
  } finally {
    conn.release();
  }
};


const deleteProduct = async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;

  try {
    const [result] = await pool.query('DELETE FROM products WHERE id = ? AND owner_id = ?', [id, userId]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Producto no encontrado o no autorizado' });
    }

    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al eliminar el producto' });
  }
};

const searchProducts = async (req, res) => {
  const { query } = req.params;

  try {
    const [rows] = await pool.query(
      `SELECT DISTINCT p.*
       FROM products p
       LEFT JOIN product_categories pc ON p.id = pc.product_id
       LEFT JOIN categories c ON pc.category_id = c.id
       WHERE p.name LIKE ? 
          OR p.brand LIKE ?
          OR c.name LIKE ?`,
      [`%${query}%`, `%${query}%`, `%${query}%`]
    );
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error en la búsqueda" });
  }
};

module.exports = {
  getProducts,
  getProductById,
  getMyProducts,
  createProduct,
  deleteProduct,
  searchProducts
};