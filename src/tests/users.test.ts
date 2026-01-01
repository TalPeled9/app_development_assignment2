import request from "supertest";
import initApp from "../app";
import { Express } from "express";
import User from "../model/userModel";
import { usersList } from "./utils"

let app: Express;
let userId = "";

beforeAll(async () => {
  app = await initApp();
  await User.deleteMany();
});

afterAll((done) => done());

describe("Users API tests", () => {
  test("Create User", async () => {
    for (const user of usersList) {
      const response = await request(app).post("/auth/register").send({
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

  test("Update User", async () => {
    usersList[0].username = "updated-username";
    usersList[0].email = "updated-email@example.com";
    const response = await request(app).put("/users/" + userId)
    .send(usersList[0]);
    expect(response.status).toBe(200);
    expect(response.body.username).toBe(usersList[0].username);
    expect(response.body.email).toBe(usersList[0].email);
  });

//   test("Delete User", async () => {
//     const response = await request(app).delete(`/users/${userId}`);
//     expect(response.status).toBe(200);

//     const getResponse = await request(app).get(`/users/${userId}`);
//     expect(getResponse.status).toBe(404);
//   });
});
