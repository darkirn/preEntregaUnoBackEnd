const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cartController');

// Rutas para carritos
router.get('/:cid', cartController.getCart);
router.post('/', cartController.createCart);
router.post('/:cid/product/:pid', cartController.addProductToCart);

module.exports = router;