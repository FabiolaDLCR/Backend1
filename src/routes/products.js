import { Router } from 'express';
import fs from 'fs/promises';
import path from 'path';

const router = Router();
const productsFilePath = path.join(process.cwd(), 'data', 'products.json');

const readProductsFile = async () => JSON.parse(await fs.readFile(productsFilePath, 'utf-8'));
const writeProductsFile = async (data) => await fs.writeFile(productsFilePath, JSON.stringify(data, null, 2));

export default (io) => {
    router.get('/', async (req, res) => {
        const products = await readProductsFile();
        const limit = req.query.limit;
        res.json(limit ? products.slice(0, limit) : products);
    });

    router.get('/:pid', async (req, res) => {
        const products = await readProductsFile();
        const product = products.find(p => p.id === req.params.pid);
        product ? res.json(product) : res.status(404).send('Product not found');
    });

    router.post('/', async (req, res) => {
        const products = await readProductsFile();
        const newProduct = { id: `${Date.now()}`, ...req.body, status: true };
        products.push(newProduct);
        await writeProductsFile(products);
        io.emit('updateProducts', products); // Notify clients
        res.status(201).json(newProduct);
    });

    router.put('/:pid', async (req, res) => {
        const products = await readProductsFile();
        const index = products.findIndex(p => p.id === req.params.pid);
        if (index === -1) return res.status(404).send('Product not found');
        const updatedProduct = { ...products[index], ...req.body };
        products[index] = updatedProduct;
        await writeProductsFile(products);
        res.json(updatedProduct);
    });

    router.delete('/:pid', async (req, res) => {
        const products = await readProductsFile();
        const newProducts = products.filter(p => p.id !== req.params.pid);
        if (newProducts.length === products.length) return res.status(404).send('Product not found');
        await writeProductsFile(newProducts);
        io.emit('updateProducts', newProducts); // Notify clients
        res.status(204).send();
    });

    return router;
};
