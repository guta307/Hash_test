import { Application } from "express";
import userRoute from "./user.route.js";
import bodyParser from "body-parser";

const routes = (app: Application): void => {
  app.use(bodyParser.json());
  app.use(userRoute);
  app.get("/", (req, res) => res.status(200).send("Olá"));
};

export default routes;