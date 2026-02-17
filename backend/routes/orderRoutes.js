const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middleware/auth');
const { createOrder, getMyOrders } = require('../controllers/orderController');


router.post('/', verifyToken, createOrder);
router.get('/mine', verifyToken, getMyOrders);


module.exports = router;

