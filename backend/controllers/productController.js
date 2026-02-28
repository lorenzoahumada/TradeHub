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
    const [rows] = await pool.query(`
      SELECT products.*, users.name AS owner_name 
      FROM products 
      JOIN users ON products.owner_id = users.id 
      WHERE products.id = ?`,
      [req.params.id]
    );
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
  const { name, type, price, stock, description, brand, categories, newCategories, images } = req.body;
  const userId = req.user.id;

  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();

    // Insertar producto
    const [result] = await conn.query(
      'INSERT INTO products (name, type, price, stock, description, brand, images, owner_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      [name, type, price, stock, description, brand, JSON.stringify(images), userId]
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

    res.status(201).json({ id: productId, name, type, price, stock, description, brand, images });
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
  const { query } = req.params;                 // término de búsqueda principal
  const { minPrice, maxPrice, brand, type, sort } = req.query; // filtros opcionales

  let sql = `
    SELECT p.*
    FROM products p
    WHERE (
      LOWER(p.name)  LIKE LOWER(?)
      OR LOWER(p.brand) LIKE LOWER(?)
      OR EXISTS (
        SELECT 1
        FROM product_categories pc
        JOIN categories c ON c.id = pc.category_id
        WHERE pc.product_id = p.id
          AND LOWER(c.name) LIKE LOWER(?)
      )
    )
  `;
  const params = [`%${query}%`, `%${query}%`, `%${query}%`];

  if (minPrice) { sql += ` AND p.price >= ?`; params.push(Number(minPrice)); }
  if (maxPrice) { sql += ` AND p.price <= ?`; params.push(Number(maxPrice)); }
  if (brand)    { sql += ` AND LOWER(p.brand) = LOWER(?)`; params.push(brand.trim()); }

  // Filtro por tipo/categoría (independiente del OR anterior)
  if (type) {
    sql += `
      AND EXISTS (
        SELECT 1
        FROM product_categories pc2
        JOIN categories c2 ON c2.id = pc2.category_id
        WHERE pc2.product_id = p.id
          AND LOWER(c2.name) = LOWER(?)
      )
    `;
    params.push(type.trim());
  }

  // Orden
  if (sort === 'price_asc'){
    sql += ` ORDER BY p.price ASC`;
  }
  else {
    sql += ` ORDER BY p.id DESC`;
  }

  try {
    const [rows] = await pool.query(sql, params);
    res.json(rows);
  } catch (err) {
    console.error('Search error:', err);
    res.status(500).json({ error: 'Error en la búsqueda' });
  }
};

const getRelatedProducts = async (req, res) => {
  const { id } = req.params;
  try {
    const [[product]] = await pool.query(
      'SELECT * FROM products WHERE id = ?',
      [id]
    );

    if (!product) {
      return res.status(404).json({ error: 'Producto no encontrado' });
    }

    const [sameType] = await pool.query(
      `SELECT * FROM products
       WHERE type = ? AND id != ?
       LIMIT 4`,
      [product.type, id]
    );

    let related = [...sameType];
    if (related.length < 4) {

      const remaining = 4 - related.length;

      const [sameBrand] = await pool.query(
        `SELECT * FROM products
         WHERE brand = ?
         AND id != ?
         AND id NOT IN (${related.map(p => p.id).join(',') || 0})
         LIMIT ?`,
        [product.brand, id, remaining]
      );
      related = [...related, ...sameBrand];
    }
    res.json(related);

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al obtener relacionados' });
  }
};

const increaseStockProduct = async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;

  try {
    const [result] = await pool.query('UPDATE products SET stock = stock + 1 WHERE id = ? AND owner_id = ?', [id, userId]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Producto no encontrado o no autorizado' });
    }

    res.json({ success: true });
  }catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al aumentar stock' });
  }
}

const decreaseStockProduct = async (req, res) => {
  const { id } = req.params;
  const { quantity } = req.body;

  try {
    const [result] = await pool.query('UPDATE products SET stock = stock - ? WHERE id = ? AND stock > 0', [quantity, id]);

    if (result.affectedRows === 0) {
      return res.status(400).json({ error: 'Sin stock disponible' });
    }

    res.json({ success: true });
  }catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al decrementar stock' });
  }
}


module.exports = {
  getProducts,
  getProductById,
  getMyProducts,
  createProduct,
  deleteProduct,
  searchProducts,
  getRelatedProducts,
  increaseStockProduct,
  decreaseStockProduct
};