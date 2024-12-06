import express from "express";
import ProductManager from '../managers/ProductManager.js';

const router = express.Router();

// Ruta GET /api/products
router.get('/', async (req, res) => {
    try {
      const { limit } = req.query;
      const products = await ProductManager.getProducts();
      if (limit) {
        return res.json(products.slice(0, limit));
      }
      res.json(products);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });
  
  // Ruta GET /api/products/:pid
  router.get('/:pid', async (req, res) => {
    try {
      const product = await ProductManager.getProductById(req.params.pid);
      if (!product) return res.status(404).json({ message: 'Producto no encontrado' });
      res.json(product);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });
  
  // Ruta POST /api/products
  router.post('/', async (req, res) => {
    try {
      const newProduct = await ProductManager.addProduct(req.body);
      res.status(201).json(newProduct);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  });
  
  // Ruta PUT /api/products/:pid
  router.put('/:pid', async (req, res) => {
    try {
      const updatedProduct = await ProductManager.updateProduct(req.params.pid, req.body);
      res.json(updatedProduct);
    } catch (error) {
      res.status(404).json({ message: error.message });
    }
  });
  
  // Ruta DELETE /api/products/:pid
  router.delete('/:pid', async (req, res) => {
    try {
      await ProductManager.deleteProduct(req.params.pid);
      res.status(204).send();
    } catch (error) {
      res.status(404).json({ message: error.message });
    }
  });
  
  export default router;