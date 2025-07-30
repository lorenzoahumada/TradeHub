const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middleware/auth');
const { getProducts, getProductById, getMyProducts, createProduct, deleteProduct } = require('../controllers/productController');

router.get('/', getProducts);
router.post('/', verifyToken, createProduct);
router.get('/mine', verifyToken, getMyProducts);
router.delete('/:id', verifyToken, deleteProduct);
router.get('/:id', getProductById);

module.exports = router;