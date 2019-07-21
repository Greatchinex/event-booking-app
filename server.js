import express from "express";
import graphqlHTTP from "express-graphql";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import { buildSchema } from "graphql";

import models from "./models";
import Event from "./models/event";
import User from "./models/users";

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

            type User {
                _id: ID!
                email: String!
                password: String
            }

            input UserInput {
                email: String!
                password: String!
            }

            input EventInput {
                title: String!
                description: String!
                price: Int!
                date: String!
            }

            type RootQuery {
                events: [Event!]!
                users: [User!]!
            }

            type RootMutation {
                createEvent(eventInput: EventInput): Event
                createUser(userInput: UserInput): User
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
                    date: new Date(args.eventInput.date),
                    creator: "5d3450a9789f3d16d746734d"
                });

                let createdEvent;
                // Save Event to Database
                return event
                    .save()
                    .then(result => {
                        createdEvent = { ...result._doc };
                        return User.findById("5d3450a9789f3d16d746734d");
                        // console.log(result._doc);
                        // return event
                    })
                    .then(user => {
                        if (!user) {
                            throw new Error("User Not Found");
                        }

                        user.createdEvents.push(event);
                        return user.save();
                    })
                    .then(result => {
                        return createdEvent;
                    })
                    .catch(err => {
                        console.log(err);
                        throw err;
                    });
                // return event;
            },
            createUser: args => {
                // Check if email already exists
                return User.findOne({ email: args.userInput.email })
                    .then(user => {
                        if (user) {
                            throw new Error("User Already Exists");
                        }
                        // Hash User Password and then create a user
                        return bcrypt.hash(args.userInput.password, 12);
                    })
                    .then(hashedPassword => {
                        const user = new User({
                            email: args.userInput.email,
                            password: hashedPassword
                        });
                        // Save User
                        return user.save();
                    })
                    .then(result => {
                        return { ...result._doc, password: null }; // password: null, Because i do not want to end the password value as a response to the front end
                    })
                    .catch(err => {
                        throw err;
                    });
            }
        },
        graphiql: true
    })
);

app.listen(port, () => {
    console.log(`Server is Listening on Port ${port}`);
});
