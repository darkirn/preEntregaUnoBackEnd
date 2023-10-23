// const express = require('express');
// const router = express.Router();
// const productController = require('../controllers/productController');

// // Rutas para productos
// router.get('/', productController.getProducts);
// router.get('/:pid', productController.getProductById);
// router.post('/', productController.addProduct);
// router.put('/:pid', productController.updateProduct);
// router.delete('/:pid', productController.deleteProduct);

// module.exports = router;

const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');

// Rutas para productos
router.get('/', (req, res) => {
  const limit = parseInt(req.query.limit); // Parsea el parámetro limit a un número entero
  productController.getProducts(req, res, limit); // Pasa el valor de limit al controlador
});
router.get('/:pid', productController.getProductById);
router.post('/', productController.addProduct);
router.put('/:pid', productController.updateProduct);
router.delete('/:pid', productController.deleteProduct);

module.exports = router;