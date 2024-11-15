import express from 'express';
import productsRouter from './routes/products.js';
import cartsRouter from './routes/carts.js';

const app = express();

app.use(express.json());
app.use('/api/products', productsRouter);
app.use('/api/carts', cartsRouter);

app.get('/', (req, res) => {
    res.redirect('/api/products');
  });

const PORT = 8080;
app.listen(PORT, () => {
  console.log(`http://localhost:${PORT}`);
});
