"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const commentsController_1 = __importDefault(require("../controller/commentsController"));
const router = express_1.default.Router();
router.route('/')
    .post(commentsController_1.default.createComment)
    .get(commentsController_1.default.getCommentsByPostId);
router.route('/:id')
    .get(commentsController_1.default.getCommentById)
    .put(commentsController_1.default.updateCommentById)
    .delete(commentsController_1.default.deleteCommentById);
exports.default = router;
//# sourceMappingURL=comments.js.map