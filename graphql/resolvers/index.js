import bcrypt from "bcryptjs";

import Event from "../../models/event";
import User from "../../models/users";

const events = eventIds => {
    return Event.find({ _id: { $in: eventIds } }) // $in: MongoDB Filter syntax to filter all _id that is equal to eventIds
        .then(events => {
            return events.map(event => {
                return {
                    ...event._doc,
                    creator: user.bind(this, event.creator)
                };
            });
        })
        .catch(err => {
            throw err;
        });
};

// User Function: To fetch a user by ID
const user = userId => {
    return User.findById(userId)
        .then(user => {
            return {
                ...user._doc,
                createdEvents: events.bind(this, user._doc.createdEvents)
            };
        })
        .catch(err => {
            throw err;
        });
};

// Resolvers Function
export default {
    events: () => {
        return Event.find()
            .then(events => {
                return events.map(event => {
                    return {
                        ...event._doc,
                        creator: user.bind(this, event._doc.creator) // To get the User object from the events type
                    };
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
                createdEvent = {
                    ...result._doc,
                    creator: user.bind(this, result._doc.creator)
                };
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
};
