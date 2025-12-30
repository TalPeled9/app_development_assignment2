const express = require('express');
const router = express.Router();
const commentsController = require('../controller/commentsController');

router.route('/')
    .post(commentsController.createComment)
    .get(commentsController.getCommentsByPostId);

router.route('/:id')
    .get(commentsController.getCommentById)
    .put(commentsController.updateCommentById)
    .delete(commentsController.deleteCommentById);

module.exports = router;
