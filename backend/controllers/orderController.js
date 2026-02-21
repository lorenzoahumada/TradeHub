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

const updateOrderStatus = async (req, res) => {
  const { orderId } = req.params;
  const { status } = req.body;
  const sellerId = req.user.id;

  try {

    // Verificar que el vendedor tenga productos en esa orden
    const [rows] = await pool.query(`
      SELECT oi.id
      FROM order_items oi
      JOIN products p ON oi.product_id = p.id
      WHERE oi.order_id = ? AND p.owner_id = ?
    `, [orderId, sellerId]);

    if (rows.length === 0) {
      return res.status(403).json({ error: 'No autorizado' });
    }

    await pool.query(
      `UPDATE orders SET status = ? WHERE id = ?`,
      [status, orderId]
    );

    res.json({ success: true });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error actualizando estado' });
  }
};

const getSellerSales = async (req, res) => {
  const userId = req.user.id;

  try {
    const [rows] = await pool.query(`
      SELECT 
        o.id AS order_id,
        o.created_at,
        
        o.total,
        o.delivery_method,
        o.payment_method,
        o.status,

        oi.quantity,
        oi.price AS item_price,

        p.id AS product_id,
        p.name AS product_name,
        p.images,

        u.name AS buyer_name,
        u.email AS buyer_email

      FROM order_items oi
      JOIN orders o ON oi.order_id = o.id
      JOIN products p ON oi.product_id = p.id
      JOIN users u ON o.user_id = u.id

      WHERE p.owner_id = ?

      ORDER BY o.created_at DESC
    `, [userId]);

    const sales = rows.map(row => ({
      ...row,
      images: (() => {
        try {
          return JSON.parse(row.images || '[]');
        } catch {
          return [row.images];
        }
      })()
    }));

    res.json(sales);

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error obteniendo ventas' });
  }
};



module.exports = {
  createOrder,
  getMyOrders,
  getSellerSales,
  updateOrderStatus
};