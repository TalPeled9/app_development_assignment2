import request from "supertest";
import initApp from "../app";
import { Express } from "express";
import User from "../model/userModel";
import { usersList, UserData, getLogedInUser } from "./utils";

let app: Express;
let loggedInUser: UserData;
let userId = "";
let userToken = "";

beforeAll(async () => {
  app = await initApp();
  await User.deleteMany();
});

afterAll((done) => done());

describe("Users API tests", () => {
  test("Create User", async () => {
    let index = 0;
    for (const user of usersList) {
      const response = await request(app).post("/auth/register").send({
        username: user.username,
        email: user.email,
        password: user.password,
      });
      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty("_id");
      expect(response.body).toHaveProperty("token");
      expect(response.body).toHaveProperty("refreshToken");
      expect(response.body.username).toBe(user.username);
      expect(response.body.email).toBe(user.email);
      if (index === 0) {
        userToken = response.body.token;
      }
      index++;
    }
  });

  test("Get all Users", async () => {
    const response = await request(app).get("/users");
    expect(response.status).toBe(200);
    expect(response.body.length).toBe(usersList.length);
    userId = response.body[0]._id; // Save the ID of the first user for later tests
  });

  test("Get User by ID", async () => {
    const response = await request(app).get("/users/" + userId);
    expect(response.status).toBe(200);
    expect(response.body._id).toBe(userId);
    expect(response.body.username).toBe(usersList[0].username);
    expect(response.body.email).toBe(usersList[0].email);
  });

  test("Get Current User", async () => {
    loggedInUser = await getLogedInUser(app);
    const response = await request(app)
      .get("/users/me")
      .set("Authorization", "Bearer " + loggedInUser.token);
    expect(response.status).toBe(200);
    expect(response.body._id).toBe(loggedInUser._id);
    expect(response.body.username).toBe(loggedInUser.username);
    expect(response.body.email).toBe(loggedInUser.email);
  });

  test("Update Current User", async () => {
    const response = await request(app)
      .put("/users/" + loggedInUser._id)
      .set("Authorization", "Bearer " + loggedInUser.token)
      .send({ username: "new-username", email: "new-email@example.com" });
    expect(response.status).toBe(200);
    expect(response.body.username).toBe("new-username");
    expect(response.body.email).toBe("new-email@example.com");
  });

  test("Update Non-Existent User Fails", async () => {
    const response = await request(app)
      .put("/users/000000000000000000000000")
      .set("Authorization", "Bearer " + loggedInUser.token)
      .send({ username: "nonexistent", email: "nonexistent@example.com" });
    expect(response.status).toBe(404);
  });

  test("Delete Non-Existent User Fails", async () => {
    const response = await request(app)
      .delete("/users/000000000000000000000000")
      .set("Authorization", "Bearer " + loggedInUser.token);
    expect(response.status).toBe(404);
  });

  test("Delete My User", async () => {
    const response = await request(app)
      .delete("/users/" + loggedInUser._id)
      .set("Authorization", "Bearer " + loggedInUser.token);
    expect(response.status).toBe(200);

    const getResponse = await request(app)
      .get("/users/" + loggedInUser._id)
      .set("Authorization", "Bearer " + loggedInUser.token);
    expect(getResponse.status).toBe(404);
  });
});
