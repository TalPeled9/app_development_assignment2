"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const posts_1 = __importDefault(require("./posts"));
const comments_1 = __importDefault(require("./comments"));
const router = express_1.default.Router();
router.use('/posts', posts_1.default);
router.use('/comments', comments_1.default);
exports.default = router;
//# sourceMappingURL=index.js.map