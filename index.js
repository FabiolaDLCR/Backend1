const express = require('express');
const productsRouter = require('./routes/products');

const app = express();
const PORT = 8080;

//// Middleware para manejar JSON
app.use(express.json());
app.use('/api/products', productsRouter);
app.listen(PORT, () => {
  console.log(`Servidor escuchando en http://localhost:${8080}`);
});
