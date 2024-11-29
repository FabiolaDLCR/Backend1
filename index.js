import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import handlebars from 'express-handlebars';
import path from 'path';
import productsRouter from './src/routes/products.js';
import cartsRouter from './src/routes/cart.js';

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer);

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(process.cwd(), 'public')));

// Handlebars setup
app.engine('handlebars', handlebars.engine());
app.set('view engine', 'handlebars');
app.set('views', path.join(process.cwd(), 'src/views'));

// Routes
app.use('/api/products', productsRouter);
app.use('/api/carts', cartsRouter);
app.get('/', (req, res) => {
  res.render('home', { title: 'Product List' });
});
app.get('/realtimeproducts', (req, res) => {
  res.render('realTimeProducts', { title: 'Real-Time Product List' });
});

// WebSocket setup
io.on('connection', (socket) => {
  console.log('New client connected');

  socket.on('productAdded', (data) => {
    io.emit('updateProducts', data);
  });

  socket.on('productDeleted', (data) => {
    io.emit('updateProducts', data);
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });
});

// Start server
const PORT = 8080;
httpServer.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
