import request from "supertest";
import initApp from "../app";
import postsModel from "../model/postsModel";
import { Express } from "express";
import { postsList, UserData, getLogedInUser } from "./utils";

let app: Express;
let postId = "";
let loggedInUser : UserData;

beforeAll(async () => {
  app = await initApp();
  await postsModel.deleteMany();
  loggedInUser = await getLogedInUser(app);
});

afterAll((done) => {
  done();
});

describe("Posts API Tests", () => {
  test("Sample Test Case", async () => {
    const response = await request(app).get("/posts");
    expect(response.status).toBe(200);
    expect(response.body).toEqual([]);
  });

  test("Create Post", async () => {
    for (const post of postsList) {
      const response = await request(app).post("/posts")
      .set("Authorization", "Bearer " + loggedInUser.token)
      .send(post);
      expect(response.status).toBe(201);
      expect(response.body.title).toBe(post.title);
      expect(response.body.content).toBe(post.content);
    }
  });

  test("Get All Posts", async () => {
    const response = await request(app).get("/posts");
    expect(response.status).toBe(200);
    expect(response.body.length).toBe(postsList.length);
    postId = response.body[0]._id; // Save the ID of the first post for later tests
  });

  test("Get Post by ID", async () => {
    const response = await request(app).get("/posts/" + postId);
    expect(response.status).toBe(200);
    expect(response.body.title).toBe(postsList[0].title);
    expect(response.body.content).toBe(postsList[0].content);
    expect(response.body._id).toBe(postId);
  });

  test("Update Post", async () => {
    const updatedPost = {
      title: "Updated Title",
      content: "Updated Content"
    };
    const response = await request(app)
      .put("/posts/" + postId)
      .set("Authorization", "Bearer " + loggedInUser.token)
      .send(updatedPost);
    expect(response.status).toBe(200);
    expect(response.body.title).toBe(updatedPost.title);
    expect(response.body.content).toBe(updatedPost.content);
  });

//   test("Delete Post", async () => {
//     const response = await request(app).delete("/posts/" + postId);
//     expect(response.status).toBe(200);
//     expect(response.body._id).toBe(postId);

//     const getResponse = await request(app).get("/posts/" + postId);
//     expect(getResponse.status).toBe(404);
//   });
});
