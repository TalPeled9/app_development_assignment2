import request from "supertest";
import initApp from "../app";
import commentsModel from "../model/commentsModel";
import { Express } from "express";
import { commentsList, CommentsData, UserData, getLogedInUser } from "./utils";

let app: Express;
let commentId = "";
let commentsByPostId: CommentsData[];
let loggedInUser : UserData;

beforeAll(async () => {
  app = await initApp();
  await commentsModel.deleteMany();
  loggedInUser = await getLogedInUser(app);
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
    for (const comment of commentsList) {
      const response = await request(app).post("/comments")
      .set("Authorization", "Bearer " + loggedInUser.token)
      .send(comment);
      expect(response.status).toBe(201);
      expect(response.body.postId).toBe(comment.postId);
      expect(response.body.author).toBe(comment.author);
      expect(response.body.content).toBe(comment.content);
    }
  });

  test("Get Comment by Post ID", async () => {
    commentsByPostId = commentsList.filter(c => c.postId === commentsList[0].postId);

    const response = await request(app).get("/comments" + "?postId=" + commentsList[0].postId);
    expect(response.status).toBe(200);
    expect(response.body.length).toBe(commentsByPostId.length);
    commentId = response.body[0]._id; // Save the ID of the first comment for later tests
  });

  test("Get Comment by ID", async () => {
    const response = await request(app).get("/comments/" + commentId );
    expect(response.status).toBe(200);
    expect(response.body.postId).toBe(commentsByPostId[0].postId);
    expect(response.body.author).toBe(commentsByPostId[0].author);
    expect(response.body.content).toBe(commentsByPostId[0].content);
    expect(response.body._id).toBe(commentId);
  });

  test("Update Comment", async () => {
    commentsByPostId[0].content = "Updated Content";
    const response = await request(app)
      .put("/comments/" + commentId)
      // .set("Authorization", "Bearer " + loggedInUser.token)
      .send(commentsByPostId[0]);
    expect(response.status).toBe(200);
    expect(response.body.content).toBe(commentsByPostId[0].content);
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
