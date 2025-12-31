import express from "express"
import commentsController from "../controller/commentsController";  

const router = express.Router();

router.route('/')
    .post(commentsController.createComment)
    .get(commentsController.getCommentsByPostId);

router.route('/:id')
    .get(commentsController.getCommentById)
    .put(commentsController.updateCommentById)
    .delete(commentsController.deleteCommentById);

export default router;
