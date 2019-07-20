import express from "express";
import graphqlHTTP from "express-graphql";
import dotenv from "dotenv";
import { buildSchema } from "graphql";

const app = express();
dotenv.config();
const port = process.env.PORT;
app.use(express.json()); // Express has its own body parser so no need 2 use d body-parser package

app.use(
    "/graphql",
    graphqlHTTP({
        schema: buildSchema(`
            type RootQuery {
                events: [String!]!
            }

            type RootMutation {
                createEvent(name: String): String
            }

            schema {
                query: RootQuery
                mutation: RootMutation
            }
        `),
        rootValue: {
            events: () => {
                return [
                    "Developers MeetUp",
                    "Employees Get Together",
                    "All Night Coding"
                ];
            },
            createEvent: args => {
                const eventName = args.name;
                return eventName;
            }
        },
        graphiql: true
    })
);

app.listen(port, () => {
    console.log(`Server is Listening on Port ${port}`);
});
