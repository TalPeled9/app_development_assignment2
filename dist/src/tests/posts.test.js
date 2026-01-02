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
const postsModel_1 = __importDefault(require("../model/postsModel"));
const utils_1 = require("./utils");
let app;
let postId = "";
let loggedInUser;
beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
    app = yield (0, app_1.default)();
    yield postsModel_1.default.deleteMany();
    // loggedInUser = await getLogedInUser(app);
}));
afterAll((done) => {
    done();
});
describe("Posts API Tests", () => {
    test("Sample Test Case", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app).get("/posts");
        expect(response.status).toBe(200);
        expect(response.body).toEqual([]);
    }));
    test("Create Post", () => __awaiter(void 0, void 0, void 0, function* () {
        for (const post of utils_1.postsList) {
            const response = yield (0, supertest_1.default)(app).post("/posts")
                //.set("Authorization", "Bearer " + loggedInUser.token)
                .send(post);
            expect(response.status).toBe(201);
            expect(response.body.title).toBe(post.title);
            expect(response.body.content).toBe(post.content);
        }
    }));
    test("Get All Posts", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app).get("/posts");
        expect(response.status).toBe(200);
        expect(response.body.length).toBe(utils_1.postsList.length);
        postId = response.body[0]._id; // Save the ID of the first post for later tests
    }));
    test("Get Post by ID", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app).get("/posts/" + postId);
        expect(response.status).toBe(200);
        expect(response.body.title).toBe(utils_1.postsList[0].title);
        expect(response.body.content).toBe(utils_1.postsList[0].content);
        expect(response.body._id).toBe(postId);
    }));
    test("Update Post", () => __awaiter(void 0, void 0, void 0, function* () {
        utils_1.postsList[0].title = "Updated Title";
        utils_1.postsList[0].content = "Updated Content";
        const response = yield (0, supertest_1.default)(app)
            .put("/posts/" + postId)
            // .set("Authorization", "Bearer " + loggedInUser.token)
            .send(utils_1.postsList[0]);
        expect(response.status).toBe(200);
        expect(response.body.title).toBe(utils_1.postsList[0].title);
        expect(response.body.content).toBe(utils_1.postsList[0].content);
    }));
    //   test("Delete Post", async () => {
    //     const response = await request(app).delete("/posts/" + postId);
    //     expect(response.status).toBe(200);
    //     expect(response.body._id).toBe(postId);
    //     const getResponse = await request(app).get("/posts/" + postId);
    //     expect(getResponse.status).toBe(404);
    //   });
});
//# sourceMappingURL=posts.test.js.map