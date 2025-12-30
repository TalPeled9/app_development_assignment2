import express from "express"
import postsController from "../controller/postsController";

const router = express.Router();

router.route('/')
    .post(postsController.createPost)
    .get(postsController.getAllPosts);

router.route('/:id')
    .get(postsController.getPostById)
    .put(postsController.updatePostById);

export default router;
