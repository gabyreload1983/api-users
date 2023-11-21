import { Router } from "express";

const router = Router();
import * as userController from "../controllers/users.controller.js";
import { authToken, authorization } from "../utils.js";

router.get("/", authToken, authorization("admin"), userController.getUsers);

router.get(
  "/:email",
  authToken,
  authorization("admin"),
  userController.getUserByEmail
);

router.post("/register", userController.register);

router.post("/login", userController.login);

router.put("/:uid", authToken, authorization("admin"), userController.update);

router.delete(
  "/:uid",
  authToken,
  authorization("admin"),
  userController.remove
);

export default router;
