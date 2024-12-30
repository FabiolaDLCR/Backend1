import { Server} from "socket.io";
import ProductManager from "../manager/ProductsManager.js";

const productManager = new ProductManager();

export const config = (httpServer) => {
    const socketServer = new Server(httpServer);

    socketServer.on("connection", async (socket) => {
      socketServer.emit("products-list", {products: await productManager.getAll()})

        socket.on("insert-product", async (data) => {
            try {
                console.log(data);
                await productManager.insertOne(data);
                socketServer.emit("products-list", {products: await productManager.getAll()})
            } catch (error) {
                socketServer.emit("error-message", {message: error.message})
            }
          
        });
        socket.on("delete-ingredient", async (data) => {
            try {
                await productManager.deleteOneById(Number(data.id));
                socketServer.emit("ingredients-list", { ingredients: await productManager.getAll() });
            } catch (error) {
                socketServer.emit("error-message", { message: error.message });
            }
        });
    });
};