const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middleware/auth');
const { createOrder, getMyOrders, getSellerSales, updateOrderStatus } = require('../controllers/orderController');


router.post('/', verifyToken, createOrder);
router.get('/mine', verifyToken, getMyOrders);
router.put('/:orderId/status', verifyToken, updateOrderStatus);
router.get('/sales', verifyToken, getSellerSales);


module.exports = router;

