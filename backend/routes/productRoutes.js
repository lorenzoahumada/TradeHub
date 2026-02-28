const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middleware/auth');
const { getProducts, 
        getProductById, 
        getMyProducts, 
        createProduct, 
        deleteProduct, 
        searchProducts, 
        getRelatedProducts,
        increaseStockProduct, 
        decreaseStockProduct 
    } = require('../controllers/productController');

router.get('/', getProducts);
router.post('/', verifyToken, createProduct);
router.get('/mine', verifyToken, getMyProducts);
router.delete('/:id', verifyToken, deleteProduct);
router.post('/:id/increase-stock', verifyToken, increaseStockProduct);
router.post('/:id/decrease-stock', verifyToken, decreaseStockProduct);
router.get('/search/:query', searchProducts);
router.get('/:id/related', getRelatedProducts);
router.get('/:id', getProductById);

module.exports = router;