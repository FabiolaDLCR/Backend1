import handlerbars from "express-handlebars";
import paths from "../utils/paths.js";

export const config = (app) => {
    app.engine("handlebars", handlerbars.engine());

    app.set("views", paths.views);

    app.set("view engine", "handlebars");
};