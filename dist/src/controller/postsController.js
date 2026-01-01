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
const postsModel_1 = __importDefault(require("../model/postsModel"));
const createPost = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const postData = req.body;
    try {
        const newPost = new postsModel_1.default(postData);
        yield newPost.save();
        res.status(201).json(newPost);
    }
    catch (error) {
        console.error(error);
        res.status(500).json("Error creating post");
    }
});
const getAllPosts = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const senderRaw = req.query.sender;
    const sender = Array.isArray(senderRaw) ? senderRaw[0] : (typeof senderRaw === 'string' ? senderRaw : undefined);
    try {
        if (sender !== undefined) {
            const posts = yield postsModel_1.default.find({ sender });
            res.status(200).json(posts);
        }
        else {
            const posts = yield postsModel_1.default.find();
            res.status(200).json(posts);
        }
    }
    catch (error) {
        console.error(error);
        res.status(500).json("Error retrieving posts");
    }
});
const getPostById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    try {
        const post = yield postsModel_1.default.findById(id);
        if (!post) {
            return res.status(404).json("Post not found");
        }
        res.status(200).json(post);
    }
    catch (error) {
        console.error(error);
        res.status(500).json("Error retrieving post");
    }
});
const updatePostById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    const updateData = req.body;
    try {
        const updatedPost = yield postsModel_1.default.findByIdAndUpdate(id, updateData, { new: true });
        if (!updatedPost) {
            return res.status(404).json("Post not found");
        }
        res.status(200).json(updatedPost);
    }
    catch (error) {
        console.error(error);
        res.status(500).json("Error updating post");
    }
});
exports.default = {
    createPost,
    getAllPosts,
    getPostById,
    updatePostById
};
//# sourceMappingURL=postsController.js.map