const fs = require('fs');
const { generateUniqueId } = require('../util');

const dataFilePath = 'carrito.json'; // Nombre del archivo JSON donde se guardarán los carritos

let carts = [];

// Cargar carritos desde el archivo JSON si existe
try {
  const data = fs.readFileSync(dataFilePath, 'utf-8');
  carts = JSON.parse(data);
} catch (error) {
  if (error.code === 'ENOENT') {
    // Si el archivo no existe, se creará un archivo vacío
    fs.writeFileSync(dataFilePath, '[]');
  } else {
    console.error('Error al cargar carritos desde el archivo JSON:', error.message);
  }
}

function saveCartsToFile() {
  fs.writeFileSync(dataFilePath, JSON.stringify(carts, null, 2), 'utf-8');
}

function getCart(req, res) {
  const cartId = req.params.cid;
  const cart = carts.find(c => c.id === cartId);

  if (cart) {
    res.json(cart);
  } else {
    res.status(404).json({ error: 'Carrito no encontrado' });
  }
}

function createCart(req, res) {
  const { products } = req.body;

  if (!Array.isArray(products) || products.length === 0) {
    return res.status(400).json({ error: 'El carrito debe contener una lista de productos' });
  }

  const cartId = generateUniqueId();

  const newCart = {
    id: cartId,
    products,
  };

  carts.push(newCart);
  saveCartsToFile(); // Guardar carritos en el archivo JSON
  res.status(201).json(newCart);
}

function addProductToCart(req, res) {
  const cartId = req.params.cid;
  const productId = req.params.pid;
  const cart = carts.find(c => c.id === cartId);

  if (!cart) {
    return res.status(404).json({ error: 'Carrito no encontrado' });
  }

  const { product, quantity } = req.body;

  if (!product || !quantity) {
    return res.status(400).json({ error: 'Se requieren los campos product e quantity en el cuerpo de la solicitud' });
  }

  const existingProduct = cart.products.find(p => p.product === productId);

  if (existingProduct) {
    existingProduct.quantity += quantity;
  } else {
    cart.products.push({ product: productId, quantity });
  }

  saveCartsToFile(); // Guardar carritos en el archivo JSON
  res.json(cart.products);
}

module.exports = { getCart, createCart, addProductToCart };