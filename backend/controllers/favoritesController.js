const pool = require('../db');

const toggleFavorite = async (req, res) => {
  const userId = req.user.id;
  const { productId } = req.params;

  try {
    const [existing] = await pool.query(
      'SELECT id FROM favorites WHERE user_id = ? AND product_id = ?',
      [userId, productId]
    );

    if (existing.length > 0) {
      await pool.query(
        'DELETE FROM favorites WHERE user_id = ? AND product_id = ?',
        [userId, productId]
      );

      return res.json({ favorited: false });
    }

    await pool.query(
      'INSERT INTO favorites (user_id, product_id) VALUES (?, ?)',
      [userId, productId]
    );

    res.json({ favorited: true });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al actualizar favorito' });
  }
};


const getFavorites = async (req, res) => {
  const userId = req.user.id;

  try {
    const [rows] = await pool.query(`
      SELECT p.*
      FROM favorites f
      JOIN products p ON p.id = f.product_id
      WHERE f.user_id = ?
    `, [userId]);

    res.json(rows);

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al obtener favoritos' });
  }
};

const getFavoriteIds = async (req, res) => {
  const userId = req.user.id;

  try {
    const [rows] = await pool.query(
      'SELECT product_id FROM favorites WHERE user_id = ?',
      [userId]
    );

    res.json(rows.map(r => r.product_id));

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al obtener favoritos' });
  }
};

module.exports = {
  toggleFavorite,
  getFavorites,
  getFavoriteIds
};