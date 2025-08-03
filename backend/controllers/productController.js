const pool = require('../db');

const getProducts = async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT products.*, users.name AS owner_name
      FROM products
      JOIN users ON products.owner_id = users.id
      ORDER BY products.id DESC
    `);

    res.json(rows);
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
  const { name, price, description, images } = req.body;
  const userId = req.user.id;

  try {
    const [result] = await pool.query(
      'INSERT INTO products (name, price, description, images, owner_id) VALUES (?, ?, ?, ?, ?)',
      [name, price, description, JSON.stringify(images), userId]
    );

    const productId = result.insertId;

    res.status(201).json({ id: productId, name, price, description, images });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al crear el producto' });
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




module.exports = {
  getProducts,
  getProductById,
  getMyProducts,
  createProduct,
  deleteProduct
};