const pool = require('../db');

const createOrder = async (req, res) => {
  const { cart, deliveryMethod, paymentMethod, formData } = req.body;
  const userId = req.user.id;

  const conn = await pool.getConnection();

  try {
    await conn.beginTransaction();

    const total = cart.reduce(
      (sum, p) => sum + p.price * p.quantity,
      0
    );

    const [orderResult] = await conn.query(
      `INSERT INTO orders 
       (user_id, total, delivery_method, payment_method, customer_data)
       VALUES (?, ?, ?, ?, ?)`,
      [userId, total, deliveryMethod, paymentMethod, JSON.stringify(formData)]
    );

    const orderId = orderResult.insertId;

    for (const item of cart) {

      await conn.query(
        `INSERT INTO order_items
         (order_id, product_id, quantity, price)
         VALUES (?, ?, ?, ?)`,
        [orderId, item.id, item.quantity, item.price]
      );

      await conn.query(
        `UPDATE products 
         SET stock = stock - ?
         WHERE id = ?`,
        [item.quantity, item.id]
      );
    }

    await conn.commit();

    res.json({ success: true });

  } catch (err) {
    await conn.rollback();
    console.error(err);
    res.status(500).json({ error: 'Error al crear orden' });
  } finally {
    conn.release();
  }
};

const parseImages = (value) => {
  if (!value) return [];

  try {
    return JSON.parse(value);
  } catch {
    return [value];
  }
};


const getMyOrders = async (req, res) => {
  const userId = req.user.id;

  try {
    const [orders] = await pool.query(
      `SELECT * FROM orders 
       WHERE user_id = ?
       ORDER BY created_at DESC`,
      [userId]
    );

    for (let order of orders) {
      const [items] = await pool.query(
        `SELECT oi.*, p.name, p.images
         FROM order_items oi
         JOIN products p ON oi.product_id = p.id
         WHERE oi.order_id = ?`,
        [order.id]
      );

      order.items = items.map(i => ({
        ...i,
        images: parseImages(i.images)
      }));
    }

    res.json(orders);

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al obtener órdenes' });
  }
};


module.exports = {
  createOrder,
  getMyOrders
};