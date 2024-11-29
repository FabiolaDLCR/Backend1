import fs from 'fs';
import path from 'path';

const CARTS_PATH = path.resolve('src/data/cart.json');

class CartManager {
  async getCarts() {
    if (!fs.existsSync(CARTS_PATH)) {
      return [];
    }
    const data = await fs.promises.readFile(CARTS_PATH, 'utf-8');
    return JSON.parse(data);
  }

  async saveCarts(carts) {
    await fs.promises.writeFile(CARTS_PATH, JSON.stringify(carts, null, 2));
  }

  async createCart() {
    const carts = await this.getCarts();
    const newCart = { id: Date.now().toString(), products: [] };
    carts.push(newCart);
    await this.saveCarts(carts);
    return newCart;
  }

  async getCartById(id) {
    const carts = await this.getCarts();
    return carts.find(c => c.id === id);
  }

  async addProductToCart(cartId, productId) {
    const carts = await this.getCarts();
    const cart = carts.find(c => c.id === cartId);
    if (!cart) throw new Error('Carrito no encontrado');

    const product = cart.products.find(p => p.product === productId);
    if (product) {
      product.quantity += 1;
    } else {
      cart.products.push({ product: productId, quantity: 1 });
    }
    await this.saveCarts(carts);
    return cart;
  }
}

export default new CartManager();