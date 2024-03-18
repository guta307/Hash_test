import { Router } from "express";
import { UserController } from "../controllers/userController/index.js";
const router = Router();

router.post("/user/create", UserController.create);

router.put("/user/validate", UserController.validate);

router.post("/user/login", UserController.login);

router.post("/user/requestPassword", UserController.requestChangePassword);

router.put("/user/changePassword", UserController.ChangePassword);

export default router;
