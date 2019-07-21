import express from "express";
import graphqlHTTP from "express-graphql";
import dotenv from "dotenv";
import { buildSchema } from "graphql";

import models from "./models";
import Event from "./models/event";

const app = express();
dotenv.config();
const port = process.env.PORT;
app.use(express.json()); // Express has its own body parser so no need 2 use d body-parser package

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
                return Event.find()
                    .then(events => {
                        return events.map(event => {
                            return { ...event._doc };
                        });
                    })
                    .catch(err => {
                        console.log(err);
                        throw err;
                    });
            },
            createEvent: args => {
                // Create an Event
                const event = new Event({
                    title: args.eventInput.title,
                    description: args.eventInput.description,
                    price: args.eventInput.price,
                    date: new Date(args.eventInput.date)
                });
                // Save Event to Database
                return event
                    .save()
                    .then(result => {
                        console.log(result._doc);
                        return { ...result._doc };
                        // return event
                    })
                    .catch(err => {
                        console.log(err);
                        throw err;
                    });
                // return event;
            }
        },
        graphiql: true
    })
);

app.listen(port, () => {
    console.log(`Server is Listening on Port ${port}`);
});
