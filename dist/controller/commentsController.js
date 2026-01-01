"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const commentsModel_1 = __importDefault(require("../model/commentsModel"));
const createComment = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const commentData = req.body;
    try {
        const newComment = new commentsModel_1.default(commentData);
        yield newComment.save();
        res.status(201).json(newComment);
    }
    catch (error) {
        console.error(error);
        res.status(500).json("Error creating comment");
    }
});
const getCommentById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    try {
        const comment = yield commentsModel_1.default.findById(id);
        if (!comment) {
            return res.status(404).json("Comment not found");
        }
        res.status(200).json(comment);
    }
    catch (error) {
        console.error(error);
        res.status(500).json("Error retrieving comment");
    }
});
const getCommentsByPostId = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const postIdRaw = req.query.postId;
    const postId = Array.isArray(postIdRaw) ? postIdRaw[0] : (typeof postIdRaw === 'string' ? postIdRaw : undefined);
    try {
        const comments = yield commentsModel_1.default.find({ postId: postId });
        res.status(200).json(comments);
    }
    catch (error) {
        console.error(error);
        res.status(500).json("Error retrieving comments");
    }
});
const updateCommentById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    const updateData = req.body;
    try {
        const updatedComment = yield commentsModel_1.default.findByIdAndUpdate(id, updateData, { new: true });
        if (!updatedComment) {
            return res.status(404).json("Comment not found");
        }
        res.status(200).json(updatedComment);
    }
    catch (error) {
        console.error(error);
        res.status(500).json("Error updating comment");
    }
});
const deleteCommentById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    try {
        const deletedComment = yield commentsModel_1.default.findByIdAndDelete(id);
        if (!deletedComment) {
            return res.status(404).json("Comment not found");
        }
        res.status(200).json("Comment deleted successfully");
    }
    catch (error) {
        console.error(error);
        res.status(500).json("Error deleting comment");
    }
});
exports.default = {
    createComment,
    getCommentById,
    getCommentsByPostId,
    updateCommentById,
    deleteCommentById
};
//# sourceMappingURL=commentsController.js.map