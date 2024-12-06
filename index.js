import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import { engine} from 'express-handlebars';
import productsRouter from './src/routes/products.js';
import cartsRouter from './src/routes/carts.js';
import ProductManager from './src/managers/ProductManager.js';

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer);


// Handlebars config
app.engine('handlebars', engine());
app.set('view engine', 'handlebars');
app.set('views', './src/views');

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('src/data'));

// Routes
app.use('/api/products', productsRouter);
app.use('/api/carts', cartsRouter);

// Home
app.get('/', async (req, res) => {
  const products = await ProductManager.getProducts();
  res.render('home', { products });
});

// Real-Time Products
app.get('/realtimeproducts', (req, res) => {
  res.render('realTimeProducts');
});

// WebSockets config
io.on('connection', async (socket) => {
  console.log('Cliente conectado');

  // products
  const products = await ProductManager.getProducts();
  socket.emit('products', products);

  // Add new product
  socket.on('addProduct', async (productData) => {
    try {
      await ProductManager.addProduct(productData);
      const updatedProducts = await ProductManager.getProducts();
      io.emit('products', updatedProducts); // Emitir productos actualizados a todos los clientes
    } catch (error) {
      socket.emit('errorMessage', error.message); // Enviar mensaje de error al cliente
    }
  });

  // Delete Product
  socket.on('delete-product', async (id) => {
    try {
      await ProductManager.deleteProduct(id);
      const updatedProducts = await ProductManager.getProducts();
      io.emit('products', updatedProducts); // Emitir productos actualizados a todos los clientes
    } catch (error) {
      socket.emit('errorMessage', 'Error al eliminar el producto.');
    }
  });
});


// Start server
const PORT = 8080;
httpServer.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
