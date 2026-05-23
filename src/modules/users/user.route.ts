import { Router, type Request, type Response } from "express";
import { userController } from "./user.controller.js";
import auth from "../../middleware/auth.js";
import { USER_ROLE } from "../../role types/role.js";

const router = Router();

router.post("/", userController.createUser);
router.get(
  "/",
  auth(USER_ROLE.admin, USER_ROLE.agent, USER_ROLE.user),
  userController.getAllUsers,
);
router.get("/:id", userController.getUserById);
router.put("/:id", userController.getUserUpdate);
router.delete("/:id", userController.deleteUsers);

export const UserRoute = router;
