import express from "express"
import commentsController from "../controller/commentsController";
import { authMiddleware } from "../middleware/authMiddleware";

const router = express.Router();

router.route('/')
    .post(authMiddleware, commentsController.createComment)
    .get(commentsController.getCommentsByPostId);

router.route('/:id')
    .get(commentsController.getCommentById)
    .put(commentsController.updateCommentById)
    .delete(commentsController.deleteCommentById);

export default router;
