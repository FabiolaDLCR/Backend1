import { Router } from 'express';
import fs from 'fs';
import path from 'path';

const router = Router();
const cartsFilePath = path.resolve('data/carts.json');
const productsFilePath = path.resolve('data/products.json');

const readCarts = () => {
  const data = fs.readFileSync(cartsFilePath, 'utf-8');
  return JSON.parse(data);
};

const writeCarts = (carts) => {
  fs.writeFileSync(cartsFilePath, JSON.stringify(carts, null, 2));
};

const generateUniqueId = () => '_' + Math.random().toString(36).substr(2, 9);

// Carrito nuevo
router.post('/', (req, res) => {
  const carts = readCarts();

  const newCart = {
    id: generateUniqueId(),
    products: []
  };

  carts.push(newCart);
  writeCarts(carts);
  res.status(201).json(newCart);
});

// Lista de proouctos en carrito existente
router.get('/:cid', (req, res) => {
  const { cid } = req.params;
  const carts = readCarts();
  const cart = carts.find(c => c.id === cid);

  if (cart) {
    res.json(cart.products);
  } else {
    res.status(404).json({ error: 'Carrito no encontrado' });
  }
});

//  Agregar al carrito
router.post('/:cid/product/:pid', (req, res) => {
  const { cid, pid } = req.params;
  const carts = readCarts();
  const products = JSON.parse(fs.readFileSync(productsFilePath, 'utf-8'));

  const cart = carts.find(c => c.id === cid);
  const productExists = products.find(p => p.id === pid);

  if (!cart) {
    return res.status(404).json({ error: 'Carrito no encontrado' });
  }

  if (!productExists) {
    return res.status(404).json({ error: 'Producto no encontrado' });
  }

  const productInCart = cart.products.find(p => p.product === pid);

  if (productInCart) {
    productInCart.quantity += 1;
  } else {
    cart.products.push({ product: pid, quantity: 1 });
  }

  writeCarts(carts);
  res.json(cart);
});

export default router;
