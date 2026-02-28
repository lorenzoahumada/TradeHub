const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middleware/auth');
const { getProductReviews, addOrUpdateReview } = require('../controllers/reviewController');

router.get('/:productId', getProductReviews);
router.post('/:productId', verifyToken, addOrUpdateReview);

module.exports = router;