"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const postsController_1 = __importDefault(require("../controller/postsController"));
const router = express_1.default.Router();
router.route('/')
    .post(postsController_1.default.createPost)
    .get(postsController_1.default.getAllPosts);
router.route('/:id')
    .get(postsController_1.default.getPostById)
    .put(postsController_1.default.updatePostById);
exports.default = router;
//# sourceMappingURL=posts.js.map