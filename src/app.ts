import express from "express";
import routes from "./routes/index";
import connectDB from "./db/database";
import dotenv from "dotenv";
dotenv.config({ path: ".env.dev" });

const app = express();
const port = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

connectDB();

app.use(express.json());

app.use("/", routes);

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
