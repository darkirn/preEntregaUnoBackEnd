const fs = require('fs');
const { generateUniqueId } = require('../util');

const dataFilePath = 'productos.json'; // Nombre del archivo JSON donde se guardarán los productos

let products = [];

// Cargar productos desde el archivo JSON si existe
try {
  const data = fs.readFileSync(dataFilePath, 'utf-8');
  products = JSON.parse(data);
} catch (error) {
  if (error.code === 'ENOENT') {
    // Si el archivo no existe, se creará un archivo vacío
    fs.writeFileSync(dataFilePath, '[]');
  } else {
    console.error('Error al cargar productos desde el archivo JSON:', error.message);
  }
}

function saveProductsToFile() {
  fs.writeFileSync(dataFilePath, JSON.stringify(products, null, 2), 'utf-8');
}

function getProducts(req, res) {
  let limit = parseInt(req.query.limit); 
  limit = isNaN(limit) ? undefined : limit; 

  let filteredProducts = limit ? products.slice(0, limit) : products; 

  res.json(filteredProducts);
}

function getProductById(req, res) {
  const productId = req.params.pid;
  const product = products.find(p => p.id === productId);
  if (product) {
    res.json(product);
  } else {
    res.status(404).json({ error: 'Producto no encontrado' });
  }
}

function addProduct(req, res) {
  const { title, description, code, price, stock, category, thumbnails } = req.body;

  if (!title || !description || !code || !price || !stock || !category) {
    return res.status(400).json({ error: 'Todos los campos son obligatorios' });
  }

  const id = generateUniqueId();

  const newProduct = {
    id,
    title,
    description,
    code,
    price,
    status: true,
    stock,
    category,
    thumbnails,
  };

  products.push(newProduct);
  saveProductsToFile(); 
  res.status(201).json(newProduct);
}

function updateProduct(req, res) {
  const productId = req.params.pid;
  const updatedProductData = req.body;

  const productIndex = products.findIndex(p => p.id === productId);

  if (productIndex === -1) {
    return res.status(404).json({ error: 'Producto no encontrado' });
  }

  products[productIndex] = { ...products[productIndex], ...updatedProductData };
  saveProductsToFile(); 
  res.json(products[productIndex]);
}

function deleteProduct(req, res) {
  const productId = req.params.pid;
  const productIndex = products.findIndex(p => p.id === productId);

  if (productIndex === -1) {
    return res.status(404).json({ error: 'Producto no encontrado' });
  }

  const deletedProduct = products.splice(productIndex, 1)[0];
  saveProductsToFile(); 
  res.json(deletedProduct);
}

module.exports = { getProducts, getProductById, addProduct, updateProduct, deleteProduct };