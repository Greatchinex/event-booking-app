import express from "express";
import graphqlHTTP from "express-graphql";
import dotenv from "dotenv";
import { buildSchema } from "graphql";

import models from "./models";

const app = express();
dotenv.config();
const port = process.env.PORT;
app.use(express.json()); // Express has its own body parser so no need 2 use d body-parser package

const events = [];

app.use(
    "/graphql",
    graphqlHTTP({
        schema: buildSchema(`
            type Event {
                _id: ID!
                title: String!
                description: String!
                price: Int!
                date: String!
            }

            input EventInput {
                title: String!
                description: String!
                price: Int!
                date: String!
            }

            type RootQuery {
                events: [Event!]!
            }

            type RootMutation {
                createEvent(eventInput: EventInput): Event
            }

            schema {
                query: RootQuery
                mutation: RootMutation
            }
        `),
        rootValue: {
            events: () => {
                return events;
            },
            createEvent: args => {
                const event = {
                    _id: Math.random().toString(),
                    title: args.eventInput.title,
                    description: args.eventInput.description,
                    price: args.eventInput.price,
                    date: args.eventInput.date
                };
                events.push(event);
                return event;
            }
        },
        graphiql: true
    })
);

app.listen(port, () => {
    console.log(`Server is Listening on Port ${port}`);
});
