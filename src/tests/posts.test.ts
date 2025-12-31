import request from "supertest";
import initApp from "../app";
import postsModel from "../model/postsModel";
import { Express } from "express";
import { postsList, PostsData } from "./utils";

let app: Express;

beforeAll(async () => {
    app = await initApp();
    await postsModel.deleteMany();
    // get logged in user if necessary
});

afterAll((done) => {
    done();
});

describe("Posts API", () => {
    test("Sample Test Case", async () => {
        const response = await request(app).get("/posts");
        expect(response.status).toBe(200);
        expect(response.body).toEqual([]);
  });

});