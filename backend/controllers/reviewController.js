const pool = require('../db');

const getProductReviews = async (req, res) => {
  const { productId } = req.params;

  try {
    const [rows] = await pool.query(
      `SELECT r.*, u.name as user_name
       FROM reviews r
       JOIN users u ON r.user_id = u.id
       WHERE r.product_id = ?
       ORDER BY r.created_at DESC`,
      [productId]
    );

    res.json(rows);

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al obtener reviews' });
  }
};

const addOrUpdateReview = async (req, res) => {
  const { productId } = req.params;
  const { rating, comment } = req.body;
  const userId = req.user.id;

  try {

    await pool.query(
      `INSERT INTO reviews (product_id, user_id, rating, comment)
       VALUES (?, ?, ?, ?)
       ON DUPLICATE KEY UPDATE
       rating = VALUES(rating),
       comment = VALUES(comment)`,
      [productId, userId, rating, comment]
    );

    res.json({ message: 'Review guardada' });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al guardar review' });
  }
};

module.exports = {
  getProductReviews,
  addOrUpdateReview
};