import express from 'express';
import CartManager from '../managers/CartManager.js';

const router = express.Router();


// Ruta POST /api/carts
router.post('/', async (req, res) => {
    try {
      const newCart = await CartManager.createCart();
      res.status(201).json(newCart);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });
  
  // Ruta GET /api/carts
  router.get('/', async (req, res) => {
    try {
      const carts = await CartManager.getCarts();
      res.json(carts);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });
  
  // Ruta GET /api/carts/:cid
  router.get('/:cid', async (req, res) => {
    try {
      const cart = await CartManager.getCartById(req.params.cid);
      if (!cart) return res.status(404).json({ message: 'Carrito no encontrado' });
      res.json(cart.products);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });
  
  // Ruta POST /api/carts/:cid/product/:pid
  router.post('/:cid/product/:pid', async (req, res) => {
    try {
      const updatedCart = await CartManager.addProductToCart(req.params.cid, req.params.pid);
      res.status(201).json(updatedCart);
    } catch (error) {
      res.status(404).json({ message: error.message });
    }
  });
  
  export default router;