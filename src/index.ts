import express from "express";
import { syncModels } from "./models/index.js";
//import routes from "./routes/index.js";
const app = express();

const port = 3000;

//routes(app);

app.listen(port, () => {
  console.log(`O server esta rodando na porta ${port}`);
});

syncModels();