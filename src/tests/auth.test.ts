import request from "supertest";
import initApp from "../app";
import { Express } from "express";
//import User from "../model/userModel";
//import { testUser } from "./utils"

let app: Express;

beforeAll(async () => {
  app = await initApp();
  //await User.deleteMany();
});

afterAll((done) => {
  done();
});

describe("Authentication API Tests", () => {
  it("should initialize the app", () => {
    expect(app).toBeDefined();
  });
});