import { Router } from "express";
import { UserController } from "../controllers/userController/index.js";
const router = Router();



router.post("/user/create", UserController.create);



export default router;