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
const supertest_1 = __importDefault(require("supertest"));
const app_1 = __importDefault(require("../app"));
const commentsModel_1 = __importDefault(require("../model/commentsModel"));
const utils_1 = require("./utils");
let app;
let commentId = "";
let commentsByPostId;
let loggedInUser;
beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
    app = yield (0, app_1.default)();
    yield commentsModel_1.default.deleteMany();
    // loggedInUser = await getLogedInUser(app);
}));
afterAll((done) => {
    done();
});
describe("Comments API Tests", () => {
    test("Sample Test Case", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app).get("/comments");
        expect(response.status).toBe(200);
        expect(response.body).toEqual([]);
    }));
    test("Create Comment", () => __awaiter(void 0, void 0, void 0, function* () {
        for (const comment of utils_1.commentsList) {
            const response = yield (0, supertest_1.default)(app).post("/comments").send(comment);
            expect(response.status).toBe(201);
            expect(response.body.postId).toBe(comment.postId);
            expect(response.body.author).toBe(comment.author);
            expect(response.body.content).toBe(comment.content);
        }
    }));
    test("Get Comment by Post ID", () => __awaiter(void 0, void 0, void 0, function* () {
        commentsByPostId = utils_1.commentsList.filter(c => c.postId === utils_1.commentsList[0].postId);
        const response = yield (0, supertest_1.default)(app).get("/comments" + "?postId=" + utils_1.commentsList[0].postId);
        expect(response.status).toBe(200);
        expect(response.body.length).toBe(commentsByPostId.length);
        commentId = response.body[0]._id; // Save the ID of the first comment for later tests
    }));
    test("Get Comment by ID", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app).get("/comments/" + commentId);
        expect(response.status).toBe(200);
        expect(response.body.postId).toBe(commentsByPostId[0].postId);
        expect(response.body.author).toBe(commentsByPostId[0].author);
        expect(response.body.content).toBe(commentsByPostId[0].content);
        expect(response.body._id).toBe(commentId);
    }));
    test("Update Comment", () => __awaiter(void 0, void 0, void 0, function* () {
        commentsByPostId[0].content = "Updated Content";
        const response = yield (0, supertest_1.default)(app)
            .put("/comments/" + commentId)
            .send(commentsByPostId[0]);
        expect(response.status).toBe(200);
        expect(response.body.content).toBe(commentsByPostId[0].content);
    }));
    test("Delete Comment", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app).delete("/comments/" + commentId);
        expect(response.status).toBe(200);
        expect(response.body._id).toBe(commentId);
        const getResponse = yield (0, supertest_1.default)(app).get("/comments/" + commentId);
        expect(getResponse.status).toBe(404);
    }));
});
//# sourceMappingURL=comments.test.js.map