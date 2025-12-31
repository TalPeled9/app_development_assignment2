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
exports.getLogedInUser = exports.testUser = exports.commentsList = exports.postsList = void 0;
const supertest_1 = __importDefault(require("supertest"));
exports.postsList = [
    { title: "First Post", content: "This is the content of the first post.", sender: "user1" },
    { title: "Second Post", content: "This is the content of the second post.", sender: "user2" },
    { title: "Third Post", content: "This is the content of the third post.", sender: "user3" }
];
exports.commentsList = [
    { postId: "000000000000000000000001", author: "commenter1", content: "This is the first comment." },
    { postId: "000000000000000000000001", author: "commenter2", content: "This is the second comment." },
    { postId: "000000000000000000000002", author: "commenter3", content: "This is the third comment." }
];
exports.testUser = {
    username: "testuser",
    email: "test@test.com",
    password: "testpass",
    _id: "",
    token: "",
    refreshToken: ""
};
const getLogedInUser = (app) => __awaiter(void 0, void 0, void 0, function* () {
    const username = exports.testUser.username;
    const email = exports.testUser.email;
    const password = exports.testUser.password;
    let response = yield (0, supertest_1.default)(app).post("/auth/register").send({ "username": username, "email": email, "password": password });
    if (response.status !== 201) {
        response = yield (0, supertest_1.default)(app).post("/auth/login").send({ "email": email, "password": password });
    }
    const logedUser = {
        _id: response.body._id,
        token: response.body.token,
        refreshToken: response.body.refreshToken,
        email: email,
        password: password,
        username: username
    };
    return logedUser;
});
exports.getLogedInUser = getLogedInUser;
//# sourceMappingURL=utils.js.map