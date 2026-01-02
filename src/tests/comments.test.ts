import request from "supertest";
import initApp from "../app";
import commentsModel from "../model/commentsModel";
import postsModel from "../model/postsModel";
import { Express } from "express";
import { UserData, getLogedInUser, postsList } from "./utils";

let app: Express;
let commentId = "";
let loggedInUser : UserData;
let postId1 = "";
let postId2 = "";

beforeAll(async () => {
  app = await initApp();
  await commentsModel.deleteMany();
  await postsModel.deleteMany();
  loggedInUser = await getLogedInUser(app);

  const post1Response = await request(app).post("/posts")
    .set("Authorization", "Bearer " + loggedInUser.token)
    .send(postsList[0]);
  postId1 = post1Response.body._id;

  const post2Response = await request(app).post("/posts")
    .set("Authorization", "Bearer " + loggedInUser.token)
    .send(postsList[1]);
  postId2 = post2Response.body._id;
});

afterAll((done) => {
  done();
});

describe("Comments API Tests", () => {
  test("Sample Test Case", async () => {
    const response = await request(app).get("/comments");
    expect(response.status).toBe(200);
    expect(response.body).toEqual([]);
  });

  test("Create Comment", async () => {
    const comment1 = {
      postId: postId1,
      content: "This is the first comment."
    };
    const response1 = await request(app).post("/comments")
      .set("Authorization", "Bearer " + loggedInUser.token)
      .send(comment1);
    expect(response1.status).toBe(201);
    expect(response1.body.postId).toBe(comment1.postId);
    expect(response1.body.author).toBe(loggedInUser._id);
    expect(response1.body.content).toBe(comment1.content);

    const comment2 = {
      postId: postId1,
      content: "This is the second comment."
    };
    const response2 = await request(app).post("/comments")
      .set("Authorization", "Bearer " + loggedInUser.token)
      .send(comment2);
    expect(response2.status).toBe(201);
    expect(response2.body.postId).toBe(comment2.postId);
    expect(response2.body.author).toBe(loggedInUser._id);
    expect(response2.body.content).toBe(comment2.content);

    // Create third comment for post2
    const comment3 = {
      postId: postId2,
      content: "This is the third comment."
    };
    const response3 = await request(app).post("/comments")
      .set("Authorization", "Bearer " + loggedInUser.token)
      .send(comment3);
    expect(response3.status).toBe(201);
    expect(response3.body.postId).toBe(comment3.postId);
    expect(response3.body.author).toBe(loggedInUser._id);
    expect(response3.body.content).toBe(comment3.content);
  });

  test("Get Comment by Post ID", async () => {
    const response = await request(app).get("/comments" + "?postId=" + postId1);
    expect(response.status).toBe(200);
    expect(response.body.length).toBe(2); // We created 2 comments for post1
    commentId = response.body[0]._id; // Save the ID of the first comment for later tests
  });

  test("Get Comment by ID", async () => {
    const response = await request(app).get("/comments/" + commentId );
    expect(response.status).toBe(200);
    expect(response.body.postId).toBe(postId1);
    expect(response.body.author).toBe(loggedInUser._id);
    expect(response.body.content).toBe("This is the first comment.");
    expect(response.body._id).toBe(commentId);
  });

  test("Update Comment", async () => {
    const updatedComment = {
      content: "Updated Content"
    };
    const response = await request(app)
      .put("/comments/" + commentId)
      // .set("Authorization", "Bearer " + loggedInUser.token)
      .send(updatedComment);
    expect(response.status).toBe(200);
    expect(response.body.content).toBe(updatedComment.content);
  });

  test("Delete Comment", async () => {
    const response = await request(app).delete("/comments/" + commentId)
    // .set("Authorization", "Bearer " + loggedInUser.token)
    ;
    expect(response.status).toBe(200);
    expect(response.body._id).toBe(commentId);

    const getResponse = await request(app).get("/comments/" + commentId);
    expect(getResponse.status).toBe(404);
  });
});
