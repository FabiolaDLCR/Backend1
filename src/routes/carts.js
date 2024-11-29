import { Router } from 'express';
import fs from 'fs/promises';
import path from 'path';

const router = Router();
const cartsFilePath = path.join(process.cwd(), 'data', 'cart.json');

const readCartsFile = async () => JSON.parse(await fs.readFile(cartsFilePath, 'utf-8'));
const writeCartsFile = async (data) => await fs.writeFile(cartsFilePath, JSON.stringify(data, null, 2));

router.post('/', async (req, res) => {
    const carts = await readCartsFile();
    const newCart = { id: `${Date.now()}`, products: [] };
    carts.push(newCart);
    await writeCartsFile(carts);
    res.status(201).json(newCart);
});

router.get('/:cid', async (req, res) => {
    const carts = await readCartsFile();
    const cart = carts.find(c => c.id === req.params.cid);
    cart ? res.json(cart) : res.status(404).send('Cart not found');
});

router.post('/:cid/product/:pid', async (req, res) => {
    const carts = await readCartsFile();
    const cartIndex = carts.findIndex(c => c.id === req.params.cid);
    if (cartIndex === -1) return res.status(404).send('Cart not found');

    const productIndex = carts[cartIndex].products.findIndex(p => p.product === req.params.pid);
    if (productIndex === -1) {
        carts[cartIndex].products.push({ product: req.params.pid, quantity: 1 });
    } else {
        carts[cartIndex].products[productIndex].quantity++;
    }
    await writeCartsFile(carts);
    res.json(carts[cartIndex]);
});

export default router;
