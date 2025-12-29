const express = require('express');
const router = express.Router();
const postsController = require('../controller/postsController');

router.route('/')
    .post(postsController.createPost)
    .get(postsController.getAllPosts);

router.route('/:id')
    .get(postsController.getPostById)
    .put(postsController.updatePostById);

module.exports = router;
