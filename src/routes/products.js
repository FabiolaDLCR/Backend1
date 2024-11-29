import express from 'express';
import ProductManager from '../managers/ProductManager';

const router = express.Router();

const productsFilePath = path.resolve('data/products.json');
const readProducts = () => {
  const data = fs.readFileSync(productsFilePath, 'utf-8');
  return JSON.parse(data);
};

router.get('/', async (req, res) => {
    const products = await ProductManager.getProducts();
    let html = `<h1>Lista de Productos</h1><ul>`;
    products.forEach(product => {
      html += `<li><strong>${product.title}</strong>: ${product.description} - $${product.price}</li>`;
    });
    html += `</ul>`;
    res.send(html);
  });
  
//escribir nuevos productos
const writeProducts = (products) => {
  fs.writeFileSync(productsFilePath, JSON.stringify(products, null, 2));
};

// Generar id
const generateUniqueId = () => '_' + Math.random().toString(36).substr(2, 9);

router.get('/', (req, res) => {
  const { limit } = req.query;
  const products = readProducts();
  const result = limit ? products.slice(0, parseInt(limit)) : products;
  res.json(result);
});

router.get('/:pid', (req, res) => {
  const { pid } = req.params;
  const products = readProducts();
  const product = products.find(p => p.id === pid);

  if (product) {
    res.json(product);
  } else {
    res.status(404).json({ error: 'Producto no encontrado' });
  }
});

router.post('/', async (req, res) => {
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

router.put('/:pid', async (req, res) => {
  const { pid } = req.params;
  const updateFields = req.body;
  const products = readProducts();

  const productIndex = products.findIndex(p => p.id === pid);

  if (productIndex !== -1) {
    const updatedProduct = { ...products[productIndex], ...updateFields, id: products[productIndex].id };
    products[productIndex] = updatedProduct;
    writeProducts(products);
    res.json(updatedProduct);
  } else {
    res.status(404).json({ error: 'Producto no encontrado' });
  }
});

// Eliminar un producto por ID
router.delete('/:pid', async (req, res) => {
  const { pid } = req.params;
  let products = readProducts();

  const productIndex = products.findIndex(p => p.id === pid);

  if (productIndex !== -1) {
    products = products.filter(p => p.id !== pid);
    writeProducts(products);
    res.json({ message: 'Producto eliminado' });
  } else {
    res.status(404).json({ error: 'Producto no encontrado' });
  }
});

export default router;
