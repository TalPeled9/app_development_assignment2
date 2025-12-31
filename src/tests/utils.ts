//import request from "supertest";
//import { Express } from "express";

export type PostsData = { title: string, content: string, sender?: string };

export const postsList: PostsData[] = [
    { title: "First Post", content: "This is the content of the first post.", sender: "user1" },
    { title: "Second Post", content: "This is the content of the second post.", sender: "user2" },
    { title: "Third Post", content: "This is the content of the third post.", sender: "user3" }
];

// export type UserData = {
//     email: string,
//     password: string,
//     _id: string,
//     token: string,
//     refreshToken: string
// };

// export const userData = {
//     email: "test@test.com",
//     password: "testpass",
//     _id: "",
//     token: "",
//     refreshToken: ""
// };

// export const getLogedInUser = async (app: Express): Promise<UserData> => {
//     const email = userData.email;
//     const password = userData.password;
//     let response = await request(app).post("/auth/register").send(
//         { "email": email, "password": password }
//     );
//     if (response.status !== 201) {
//         response = await request(app).post("/auth/login").send(
//             { "email": email, "password": password });
//     }
//     const logedUser = {
//         _id: response.body._id,
//         token: response.body.token,
//         refreshToken: response.body.refreshToken,
//         email: email,
//         password: password
//     };
//     return logedUser;
// }