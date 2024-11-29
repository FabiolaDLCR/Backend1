import fs from 'fs';
import path from 'path';

const PRODUCTS_PATH = path.resolve('src/data/products.json');

class ProductManager {
  async getProducts() {
    if (!fs.existsSync(PRODUCTS_PATH)) {
      return [];
    }
    const data = await fs.promises.readFile(PRODUCTS_PATH, 'utf-8');
    return JSON.parse(data);
  }

  async saveProducts(products) {
    await fs.promises.writeFile(PRODUCTS_PATH, JSON.stringify(products, null, 2));
  }

  async addProduct(product) {
    const products = await this.getProducts();
    if (products.some(p => p.code === product.code)) {
      throw new Error(`El código ${product.code} ya existe.`);
    }
    product.id = `${Date.now().toString().slice(-4)}`;
    products.push(product);
    await this.saveProducts(products);
    return product;
  }

  async getProductById(id) {
    const products = await this.getProducts();
    return products.find(p => p.id === id);
  }

  async updateProduct(id, updatedData) {
    const products = await this.getProducts();
    const index = products.findIndex(p => p.id === id);
    if (index === -1) throw new Error('El producto no existe');
    products[index] = { ...products[index], ...updatedData };
    await this.saveProducts(products);
    return products[index];
  }

  async deleteProduct(id) {
    const products = await this.getProducts();
    const index = products.findIndex(p => p.id === id);
    if (index === -1) throw new Error('Producto no encontrado');
    products.splice(index, 1);
    await this.saveProducts(products);
  }
}

export default new ProductManager();