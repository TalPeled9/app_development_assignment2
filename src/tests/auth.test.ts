import request from "supertest";
import initApp from "../app";
import { Express } from "express";
import User from "../model/userModel";
import { testUser, postsList } from "./utils"

let app: Express;

beforeAll(async () => {
  app = await initApp();
  await User.deleteMany();
});

afterAll((done) => {
  done();
});

describe("Authentication API Tests", () => {
  test("Test posting a post without token fails", async () => {
    const postData = postsList[0];
    const response = await request(app).post("/posts").send(postData);
    expect(response.status).toBe(401);
  });

    test("Test Registration", async () => {
    const username = testUser.username;
    const email = testUser.email;
    const password = testUser.password;
    const response = await request(app).post("/auth/register").send(
      { "username": username, "email": email, "password": password }
    );
    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty("token");
    testUser.token = response.body.token;
    //check refresh token
    expect(response.body).toHaveProperty("refreshToken");
    testUser.refreshToken = response.body.refreshToken;
    testUser._id = response.body._id;
  });

  test("Posting a post with token succeeds", async () => {
    const postData = postsList[0];
    const response = await request(app)
      .post("/posts")
      .set("Authorization", "Bearer " + testUser.token)
      .send(postData);
    expect(response.status).toBe(201);
  });

  test("Posting a post with compromised token fails", async () => {
    const postData = postsList[0];
    const compromizedToken = testUser.token + "a";
    const response = await request(app)
      .post("/posts")
      .set("Authorization", "Bearer " + compromizedToken)
      .send(postData);
    expect(response.status).toBe(401);
  });

  test("Test Login", async () => {
    const email = testUser.email;
    const password = testUser.password;
    const response = await request(app).post("/auth/login").send(
      { "email": email, "password": password }
    );
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("token");
    expect(response.body).toHaveProperty("refreshToken");
    testUser.token = response.body.token;
    testUser.refreshToken = response.body.refreshToken;
  });

  jest.setTimeout(10000);

  test("Test using token after expiration fails", async () => {
    //sleep for 5 seconds to let the token expire
    await new Promise((r) => setTimeout(r, 5000));
    const postData = postsList[0];
    const response = await request(app)
      .post("/posts")
      .set("Authorization", "Bearer " + testUser.token)
      .send(postData);
    expect(response.status).toBe(401);

    //refresh the token
    const refreshResponse = await request(app).post("/auth/refresh").send(
      { "refreshToken": testUser.refreshToken }
    );
    expect(refreshResponse.status).toBe(200);
    expect(refreshResponse.body).toHaveProperty("token");
    testUser.token = refreshResponse.body.token;
    testUser.refreshToken = refreshResponse.body.refreshToken;

    //try to create movie again
    const retryResponse = await request(app)
      .post("/posts")
      .set("Authorization", "Bearer " + testUser.token)
      .send(postData);
    expect(retryResponse.status).toBe(201);
  });

  //test double use of refresh token fails
  test("Test double use of refresh token fails", async () => {
    //use the current refresh token to get a new token
    const refreshResponse1 = await request(app).post("/auth/refresh").send(
      { "refreshToken": testUser.refreshToken }
    );
    expect(refreshResponse1.status).toBe(200);
    expect(refreshResponse1.body).toHaveProperty("token");
    const newRefreshToken = refreshResponse1.body.refreshToken;

    //try to use the same refresh token again
    const refreshResponse2 = await request(app).post("/auth/refresh").send(
      { "refreshToken": testUser.refreshToken }
    );
    expect(refreshResponse2.status).toBe(401);

    //try to use the new refresh token also fails
    const refreshResponse3 = await request(app).post("/auth/refresh").send(
      { "refreshToken": newRefreshToken }
    );
    expect(refreshResponse3.status).toBe(401);
  });
});