import request from "supertest";
import { Express } from "express";

export type PostsData = {
  title: string;
  content: string;
  sender?: string;
  _id?: string;
};

export const postsList: PostsData[] = [
  {
    title: "First Post",
    content: "This is the content of the first post.",
  },
  {
    title: "Second Post",
    content: "This is the content of the second post.",
  },
  {
    title: "Third Post",
    content: "This is the content of the third post.",
    },
];

export type CommentsData = {
  content: string;
  postId?: string;
  author?: string;
  createdAt?: Date;
  _id?: string;
};

export const commentsList: CommentsData[] = [
  {
    content: "This is the first comment.",
  },
  {
    content: "This is the second comment.",
  },
  {
    content: "This is the third comment.",
  },
];

export type UserData = {
  username: string;
  email: string;
  password: string;
  _id?: string;
  token?: string;
  refreshToken?: string;
};

export const usersList: UserData[] = [
  {
    username: "testuser",
    email: "test@test.com",
    password: "testpass",
    _id: "",
    token: "",
    refreshToken: "",
  },
  {
    username: "user1",
    email: "user1@example.com",
    password: "Passw0rd1",
    _id: "",
    token: "",
    refreshToken: "",
  },
  {
    username: "user2",
    email: "user2@example.com",
    password: "Passw0rd2",
    _id: "",
    token: "",
    refreshToken: "",
  },
];

export const testUser: UserData = usersList[0];

export const getLogedInUser = async (app: Express): Promise<UserData> => {
  const username = testUser.username;
  const email = testUser.email;
  const password = testUser.password;
  let response = await request(app)
    .post("/auth/register")
    .send({ username: username, email: email, password: password });
  if (response.status !== 201) {
    response = await request(app)
      .post("/auth/login")
      .send({ email: email, password: password });
  }
  const logedUser = {
    _id: response.body._id,
    token: response.body.token,
    refreshToken: response.body.refreshToken,
    email: email,
    password: password,
    username: username,
  };
  return logedUser;
};

let otherUserPostIdCache = "";

export const ensureOtherUserPost = async (app: Express): Promise<string> => {
  if (otherUserPostIdCache) return otherUserPostIdCache;

  let auth = await request(app).post("/auth/register").send(usersList[1]);
  if (auth.status !== 201) {
    auth = await request(app).post("/auth/login").send({ email: usersList[1].email, password: usersList[1].password });
  }
  const otherToken = auth.body.token;
  const createOther = await request(app)
    .post("/posts")
    .set("Authorization", "Bearer " + otherToken)
    .send({ title: "Other Post", content: "Owned by other user" });
  otherUserPostIdCache = createOther.body._id;
  return otherUserPostIdCache;
};
