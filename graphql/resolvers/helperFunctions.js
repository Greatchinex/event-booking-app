import Event from "../../models/event";
import User from "../../models/users";

import { dateToString } from "../../helpers/date";

// Fetch Multiple Event
const events = async eventIds => {
    try {
        const events = await Event.find({ _id: { $in: eventIds } }); // $in: MongoDB Filter syntax to filter all _id that is equal to eventIds
        return events.map(event => {
            return tranformEvent(event);
        });
    } catch (err) {
        throw err;
    }
};

// Fetch a single event
const singleEvent = async eventId => {
    try {
        const event = await Event.findById({ eventId });
        return tranformEvent(event);
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

const tranformEvent = event => {
    return {
        ...event._doc,
        date: dateToString(event._doc.date),
        creator: user.bind(this, event._doc.creator) // To get the User object from the events type
    };
};

const transformBooking = booking => {
    return {
        ...booking._doc,
        user: user.bind(this, booking._doc.user),
        event: singleEvent.bind(this, booking._doc.event),
        createdAt: dateToString(booking._doc.createdAt),
        updatedAt: dateToString(booking._doc.updatedAt)
    };
};

export { events, singleEvent, user, tranformEvent, transformBooking };
