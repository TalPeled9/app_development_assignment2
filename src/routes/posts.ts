import express from "express"
import postsController from "../controller/postsController";
import { authMiddleware } from "../middleware/authMiddleware";

const router = express.Router();

router.route('/')
    .post(authMiddleware, postsController.createPost)
    .get(postsController.getAllPosts);

router.route('/:id')
    .get(postsController.getPostById)
    .put(postsController.updatePostById)
    .delete(postsController.deletePostById);

export default router;
