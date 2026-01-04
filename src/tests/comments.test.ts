import request from "supertest";
import initApp from "../app";
import commentsModel from "../model/commentsModel";
import postsModel from "../model/postsModel";
import { Express } from "express";
import { UserData, getLogedInUser, postsList, commentsList } from "./utils";

let app: Express;
let commentId = "";
let loggedInUser: UserData;
let postId1 = "";
let postId2 = "";
let nonexistentid = "000000000000000000000999";

beforeAll(async () => {
  app = await initApp();
  await commentsModel.deleteMany();
  await postsModel.deleteMany();
  loggedInUser = await getLogedInUser(app);

  const post1Response = await request(app)
    .post("/posts")
    .set("Authorization", "Bearer " + loggedInUser.token)
    .send(postsList[0]);
  postId1 = post1Response.body._id;

  const post2Response = await request(app)
    .post("/posts")
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
    commentsList[0].postId = postId1;
    commentsList[1].postId = postId1;
    commentsList[2].postId = postId2;
    for (const comment of commentsList) {
      const response = await request(app)
        .post("/comments")
        .set("Authorization", "Bearer " + loggedInUser.token)
        .send(comment);
      expect(response.status).toBe(201);
      expect(response.body.postId).toBe(comment.postId);
      expect(response.body.author).toBe(loggedInUser._id);
      expect(response.body.content).toBe(comment.content);
    }
  });

  test("Create Comment Unauthorized fails", async () => {
    const comment = {
      postId: postId1,
      content: "Unauthorized comment",
    };
    const response = await request(app).post("/comments").send(comment);
    expect(response.status).toBe(401);
  });

  test("Get Comment by Post ID", async () => {
    const response = await request(app).get("/comments" + "?postId=" + postId1);
    expect(response.status).toBe(200);
    expect(response.body.length).toBe(2); // We created 2 comments for post1
    commentId = response.body[0]._id; // Save the ID of the first comment for later tests
  });

  test("Get Comments by Non-existent Post ID returns empty", async () => {
    const response = await request(app).get(
      "/comments" + "?postId=" + nonexistentid
    );
    expect(response.status).toBe(200);
    expect(response.body.length).toBe(0);
  });

  test("Get Comment by ID", async () => {
    const response = await request(app).get("/comments/" + commentId);
    expect(response.status).toBe(200);
    expect(response.body.postId).toBe(postId1);
    expect(response.body.author).toBe(loggedInUser._id);
    expect(response.body.content).toBe(commentsList[0].content);
    expect(response.body._id).toBe(commentId);
  });

  test("Get Non-existent Comment by ID fails", async () => {
    const response = await request(app).get("/comments/" + nonexistentid);
    expect(response.status).toBe(404);
  });

  test("Update Comment Unauthorized fails", async () => {
    const updatedComment = {
      content: "Malicious Update",
    };
    const response = await request(app)
      .put("/comments/" + commentId)
      .send(updatedComment);
    expect(response.status).toBe(401);
  });

  test("Update Non-existent Comment fails", async () => {
    const updatedComment = {
      content: "Update Non-existent",
    };
    const response = await request(app)
      .put("/comments/" + nonexistentid)
      .set("Authorization", "Bearer " + loggedInUser.token)
      .send(updatedComment);
    expect(response.status).toBe(404);
  });

  test("Update Comment", async () => {
    const updatedComment = {
      content: "Updated Content",
    };
    const response = await request(app)
      .put("/comments/" + commentId)
      .set("Authorization", "Bearer " + loggedInUser.token)
      .send(updatedComment);
    expect(response.status).toBe(200);
    expect(response.body.content).toBe(updatedComment.content);

    const getResponse = await request(app)
      .get("/comments/" + commentId)
      .set("Authorization", "Bearer " + loggedInUser.token);
    expect(getResponse.status).toBe(200);
    expect(getResponse.body.content).toBe(updatedComment.content);
  });

  test("Delete Comment Unauthorized fails", async () => {
    const response = await request(app).delete("/comments/" + commentId);
    expect(response.status).toBe(401);
  });

  test("Delete Non-existent Comment fails", async () => {
    const response = await request(app)
      .delete("/comments/" + nonexistentid)
      .set("Authorization", "Bearer " + loggedInUser.token);
    expect(response.status).toBe(404);
  });

  test("Delete Comment", async () => {
    const response = await request(app)
      .delete("/comments/" + commentId)
      .set("Authorization", "Bearer " + loggedInUser.token);
    expect(response.status).toBe(200);
    expect(response.body._id).toBe(commentId);

    const getResponse = await request(app)
      .get("/comments/" + commentId)
      .set("Authorization", "Bearer " + loggedInUser.token);
    expect(getResponse.status).toBe(404);
  });
});
