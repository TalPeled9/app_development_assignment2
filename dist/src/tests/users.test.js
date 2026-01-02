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
// import User from "../model/userModel";
const utils_1 = require("./utils");
let app;
let userId = "";
beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
    app = yield (0, app_1.default)();
    // await User.deleteMany();
}));
afterAll((done) => done());
describe("Users API tests", () => {
    test("Create User", () => __awaiter(void 0, void 0, void 0, function* () {
        for (const user of utils_1.usersList) {
            const response = yield (0, supertest_1.default)(app).post("/auth/register").send({
                "username": user.username,
                "email": user.email,
                "password": user.password,
            });
            expect(response.status).toBe(201);
            expect(response.body).toHaveProperty("_id");
            expect(response.body).toHaveProperty("token");
            expect(response.body).toHaveProperty("refreshToken");
            expect(response.body.username).toBe(user.username);
            expect(response.body.email).toBe(user.email);
        }
    }));
    test("Get all Users", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app).get("/users");
        expect(response.status).toBe(200);
        expect(response.body.length).toBe(utils_1.usersList.length);
        userId = response.body[0]._id; // Save the ID of the first user for later tests
    }));
    test("Get User by ID", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app).get("/users/" + userId);
        expect(response.status).toBe(200);
        expect(response.body._id).toBe(userId);
        expect(response.body.username).toBe(utils_1.usersList[0].username);
        expect(response.body.email).toBe(utils_1.usersList[0].email);
    }));
    test("Update User", () => __awaiter(void 0, void 0, void 0, function* () {
        utils_1.usersList[0].username = "updated-username";
        utils_1.usersList[0].email = "updated-email@example.com";
        const response = yield (0, supertest_1.default)(app).put("/users/" + userId)
            .send(utils_1.usersList[0]);
        expect(response.status).toBe(200);
        expect(response.body.username).toBe(utils_1.usersList[0].username);
        expect(response.body.email).toBe(utils_1.usersList[0].email);
    }));
    //   test("Delete User", async () => {
    //     const response = await request(app).delete(`/users/${userId}`);
    //     expect(response.status).toBe(200);
    //     const getResponse = await request(app).get(`/users/${userId}`);
    //     expect(getResponse.status).toBe(404);
    //   });
});
//# sourceMappingURL=users.test.js.map