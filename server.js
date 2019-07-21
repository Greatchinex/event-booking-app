import express from "express";
import graphqlHTTP from "express-graphql";
import dotenv from "dotenv";

import models from "./models";
import graphQlSchema from "./graphql/schema/index";
import graphQlResolvers from "./graphql/resolvers/index";

const app = express();
dotenv.config();
const port = process.env.PORT;
app.use(express.json()); // Express has its own body parser so no need 2 use d body-parser package

app.use(
    "/graphql",
    graphqlHTTP({
        schema: graphQlSchema,
        rootValue: graphQlResolvers,
        graphiql: true
    })
);

app.listen(port, () => {
    console.log(`Server is Listening on Port ${port}`);
});
