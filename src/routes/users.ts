import express from "express";
import { getAllUsers, getCurrentUser, getUserById, updateUser, deleteUser } from "../controller/userController";
import { authMiddleware } from "../middleware/authMiddleware";

const router = express.Router();

router.get("/", getAllUsers);
router.get("/me", authMiddleware, getCurrentUser);
router.get("/:id", getUserById);
router.put("/:id", authMiddleware, updateUser);
router.delete("/:id", authMiddleware, deleteUser);

export default router;
