const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middleware/auth');
const { toggleFavorite, getFavorites, getFavoriteIds } = require('../controllers/favoritesController');

router.post('/:productId', verifyToken, toggleFavorite);
router.get('/', verifyToken, getFavorites);
router.get('/ids', verifyToken, getFavoriteIds);

module.exports = router;