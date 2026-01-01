import postsModel from "../model/postsModel";
import { Request, Response } from "express";

const createPost = async (req: Request, res: Response) => {
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

const getAllPosts = async (req: Request, res: Response) => {
    const senderRaw = req.query.sender;
    const sender = Array.isArray(senderRaw) ? senderRaw[0] : (typeof senderRaw === 'string' ? senderRaw : undefined);
    try {
        if (sender !== undefined) {
            const posts = await postsModel.find({ sender });
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

const getPostById = async (req: Request, res: Response) => {
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

const updatePostById = async (req: Request, res: Response) => {
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

export default {
    createPost,
    getAllPosts,
    getPostById,
    updatePostById
};
