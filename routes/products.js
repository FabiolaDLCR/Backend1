const express = require('express');
const fs = require('fs');
const path = require('path');
const router = express.Router();

const productsFilePath = path.join(__dirname, '../data/products.json');

//// Leer productos 
const readProducts = () => {
  const data = fs.readFileSync(productsFilePath, 'utf-8');
  return JSON.parse(data);
};

//// Guardar productos en archivo JSON
const writeProducts = (products) => {
  fs.writeFileSync(productsFilePath, JSON.stringify(products, null, 2));
};

const generateUniqueId = () => '_' + Math.random().toString(36).substr(2, 9);

//// Hscer lista de produtos
router.get('/', (req, res) => {
  const { limit } = req.query;
  const products = readProducts();
  const result = limit ? products.slice(0, parseInt(limit)) : products;
  res.json(result);
});

////  Traer productos con ID
router.get('/:pid', (req, res) => {
  const { pid } = req.params;
  const products = readProducts();
  const product = products.find(p => p.id === pid);
  
  if (product) {
    res.json(product);
  } else {
    res.status(404).json({ error: 'No se encontro el producto' });
  }
});
////Agregar productos
router.post('/', (req, res) => {
  const { title, description, code, price, stock, category, thumbnails = [] } = req.body;
  const products = readProducts();
  
  const newProduct = {
    id: generateUniqueId(),
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
  writeProducts(products);
  res.status(201).json(newProduct);
});

module.exports = router;
