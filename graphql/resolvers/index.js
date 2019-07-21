import bcrypt from "bcryptjs";

import Event from "../../models/event";
import User from "../../models/users";
import Booking from "../../models/booking";

// Fetch Multiple Event
const events = async eventIds => {
    try {
        const events = await Event.find({ _id: { $in: eventIds } }); // $in: MongoDB Filter syntax to filter all _id that is equal to eventIds
        return events.map(event => {
            return {
                ...event._doc,
                date: new Date(event._doc.date).toISOString(),
                creator: user.bind(this, event.creator)
            };
        });
        // return events;
    } catch (err) {
        throw err;
    }
};

// Fetch a single event
const singleEvent = async eventId => {
    try {
        const event = await Event.findById({ eventId });
        return {
            ...event._doc,
            creator: user.bind(this, event.creator)
        };
    } catch (err) {
        throw err;
    }
};

// User Function: To fetch a user by ID
const user = async userId => {
    try {
        const user = await User.findById(userId);
        return {
            ...user._doc,
            createdEvents: events.bind(this, user._doc.createdEvents)
        };
    } catch (err) {
        throw err;
    }
};

// Resolvers Function
export default {
    events: async () => {
        try {
            const events = await Event.find();
            return events.map(event => {
                return {
                    ...event._doc,
                    date: new Date(event._doc.date).toISOString(),
                    creator: user.bind(this, event._doc.creator) // To get the User object from the events type
                };
            });
        } catch (err) {
            throw err;
        }
    },
    bookings: async () => {
        try {
            const bookings = await Booking.find();
            return bookings.map(booking => {
                return {
                    ...booking._doc,
                    user: user.bind(this, booking._doc.user),
                    event: singleEvent.bind(this, booking._doc.event),
                    createdAt: new Date(booking._doc.createdAt).toISOString(),
                    updatedAt: new Date(booking._doc.updatedAt).toISOString()
                };
            });
        } catch (err) {
            throw err;
        }
    },
    createEvent: async args => {
        // Create an Event
        const event = new Event({
            title: args.eventInput.title,
            description: args.eventInput.description,
            price: args.eventInput.price,
            date: new Date(args.eventInput.date),
            creator: "5d3488b8c77b162ef64e712a"
        });

        let createdEvent;
        try {
            // Save Event to Database
            const result = await event.save();
            createdEvent = {
                ...result._doc,
                date: new Date(event._doc.date).toISOString(),
                creator: user.bind(this, result._doc.creator)
            };
            const creator = await User.findById("5d3488b8c77b162ef64e712a");
            // console.log(result._doc);
            // return event
            if (!creator) {
                throw new Error("User Not Found");
            }

            creator.createdEvents.push(event);
            await creator.save();

            return createdEvent;
        } catch (err) {
            throw err;
        }
    },
    createUser: async args => {
        try {
            // Check if email already exists
            const existingUser = await User.findOne({
                email: args.userInput.email
            });
            if (existingUser) {
                throw new Error("User Already Exists");
            }
            // Hash User Password and then create a user
            const hashedPassword = await bcrypt.hash(
                args.userInput.password,
                12
            );

            const user = new User({
                email: args.userInput.email,
                password: hashedPassword
            });
            // Save User
            const result = await user.save();
            return {
                ...result._doc,
                password: null // password: null, Because i do not want to end the password value as a response to the front end
            };
        } catch (err) {
            throw err;
        }
    },
    bookEvent: async args => {
        try {
            const fetchedEvent = await Event.findOne({ _id: args.eventId });
            const booking = new Booking({
                user: "5d3488b8c77b162ef64e712a",
                event: fetchedEvent
            });
            const result = await booking.save();
            return {
                ...result._doc,
                user: user.bind(this, booking._doc.user),
                event: singleEvent.bind(this, booking._doc.event),
                createdAt: new Date(result._doc.createdAt).toISOString(),
                updatedAt: new Date(result._doc.updatedAt).toISOString()
            };
        } catch (err) {
            throw err;
        }
    },
    cancelBooking: async args => {
        try {
            // Get the id of the booking
            const booking = await Booking.findById(args.bookingId).populate(
                "event"
            ); // populate("event"): to access the events array that was referenced in the mongoose Schema
            // Get the event that was booked
            const event = {
                ...booking.event._doc,
                creator: user.bind(this, booking.event._doc.creator)
            };
            // Delete Booking
            await Booking.deleteOne({ _id: args.bookingId });
            return event;
        } catch (err) {
            throw err;
        }
    }
};
