import commentsModel from "../model/commentsModel";
import { Request, Response } from "express";

const createComment = async (req: Request, res: Response) => {
    const commentData = req.body;
    try {
        const newComment = new commentsModel(commentData);
        await newComment.save();
        res.status(201).json(newComment);
    } catch (error) {
        console.error(error);
        res.status(500).json("Error creating comment");
    }
};

const getCommentById = async (req: Request, res: Response) => {
    const id = req.params.id;
    try {
        const comment = await commentsModel.findById(id);
        if (!comment) {
            return res.status(404).json("Comment not found");
        }
        res.status(200).json(comment);
    } catch (error) {
        console.error(error);
        res.status(500).json("Error retrieving comment");
    }
};

const getCommentsByPostId = async (req: Request, res: Response) => {
    const postIdRaw = req.query.postId;
    const postId = Array.isArray(postIdRaw) ? postIdRaw[0] : (typeof postIdRaw === 'string' ? postIdRaw : undefined);
    try {
        const comments = await commentsModel.find({ postId: postId });
        res.status(200).json(comments);
    } catch (error) {
        console.error(error);
        res.status(500).json("Error retrieving comments");
    }
};

const updateCommentById = async (req: Request, res: Response) => {
    const id = req.params.id;
    const updateData = req.body;
    try {
        const updatedComment = await commentsModel.findByIdAndUpdate(id, updateData, { new: true });
        if (!updatedComment) {
            return res.status(404).json("Comment not found");
        }
        res.status(200).json(updatedComment);
    } catch (error) {
        console.error(error);
        res.status(500).json("Error updating comment");
    }
};

const deleteCommentById = async (req: Request, res: Response) => {
    const id = req.params.id;
    try {
        const deletedComment = await commentsModel.findByIdAndDelete(id);
        if (!deletedComment) {
            return res.status(404).json("Comment not found");
        }
        res.status(200).json(deletedComment);
    } catch (error) {
        console.error(error);
        res.status(500).json("Error deleting comment");
    }
};

export default {
    createComment,
    getCommentById,
    getCommentsByPostId,
    updateCommentById,
    deleteCommentById
};
