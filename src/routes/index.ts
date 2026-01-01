import express from "express";
import postsRouter from "./posts";
import commentsRouter from "./comments";

const router = express.Router();

router.use('/posts', postsRouter);
router.use('/comments', commentsRouter);

export default router;
