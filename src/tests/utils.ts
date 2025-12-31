import request from "supertest";
import { Express } from "express";

export type PostsData = {
  title: string;
  content: string;
  sender: string;
  _id?: string;
};

export const postsList: PostsData[] = [
  {
    title: "First Post",
    content: "This is the content of the first post.",
    sender: "user1",
  },
  {
    title: "Second Post",
    content: "This is the content of the second post.",
    sender: "user2",
  },
  {
    title: "Third Post",
    content: "This is the content of the third post.",
    sender: "user3",
  },
];

export type CommentsData = {
  postId: string;
  author: string;
  content: string;
  createdAt?: Date;
  _id?: string;
};

export const commentsList: CommentsData[] = [
  {
    postId: "000000000000000000000001",
    author: "commenter1",
    content: "This is the first comment.",
  },
  {
    postId: "000000000000000000000001",
    author: "commenter2",
    content: "This is the second comment.",
  },
  {
    postId: "000000000000000000000002",
    author: "commenter3",
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
