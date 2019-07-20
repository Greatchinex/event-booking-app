import express from "express";
import expressGraphQL from "express-graphql";
import dotenv from "dotenv";

const app = express();
dotenv.config();

const port = process.env.PORT;

app.listen(port, () => {
  console.log(`Server is Listening on Port ${port}`);
});
