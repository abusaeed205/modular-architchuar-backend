import { Router, type Request, type Response } from "express";
import { userController } from "./user.controller.js";

const router = Router()

router.post("/", userController.createUser)
router.get("/", userController.getAllUsers)
router.get("/:id", userController.getUserById)
router.put("/:id", userController.getUserUpdate)
router.delete("/:id", userController.deleteUsers)



export const UserRoute = router


