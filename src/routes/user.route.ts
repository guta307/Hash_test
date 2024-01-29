import { Router } from "express";
import { UserController } from "../controllers/userController/index.js";
const router = Router();



router.post("/user/create", UserController.create);

router.get("/user/validate/:id", UserController.validate)


export default router;