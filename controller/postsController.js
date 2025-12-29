const postsModel = require('../model/postsModel');

const createPost = async (req, res) => {
    const postData = req.body;
    try {
        const newPost = new postsModel(postData);
        await newPost.save();
        res.status(201).json(newPost);
    } catch (error) {
        console.error(error);
        res.status(500).json("Error creating post");
    }
};

const getAllPosts = async (req, res) => {
    const sender = req.query.sender;
    try {
        if (sender) {
            const posts = await postsModel.find({ sender: sender });
            res.status(200).json(posts);
        } else {
            const posts = await postsModel.find();
            res.status(200).json(posts);
        }
    } catch (error) {
        console.error(error);
        res.status(500).json("Error retrieving posts");
    }
};

const getPostById = async (req, res) => {
    const id = req.params.id;
    try {
        const post = await postsModel.findById(id);
        if (!post) {
            return res.status(404).json("Post not found");
        }
        res.status(200).json(post);
    } catch (error) {
        console.error(error);
        res.status(500).json("Error retrieving post");
    }
};

const updatePostById = async (req, res) => {
    const id = req.params.id;
    const updateData = req.body;
    try {
        const updatedPost = await postsModel.findByIdAndUpdate(id, updateData, { new: true });
        if (!updatedPost) {
            return res.status(404).json("Post not found");
        }
        res.status(200).json(updatedPost);
    } catch (error) {
        console.error(error);
        res.status(500).json("Error updating post");
    }
};

module.exports = { createPost, getAllPosts, getPostById, updatePostById };
