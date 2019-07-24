import Event from "../../models/event";
import User from "../../models/users";
import { tranformEvent } from "./helperFunctions";

// Resolvers Function
export default {
    events: async () => {
        try {
            const events = await Event.find();
            return events.map(event => {
                return tranformEvent(event);
            });
        } catch (err) {
            throw err;
        }
    },
    createEvent: async (args, req) => {
        // Check if User is Authenticated Cause only Authenticated users can create events
        if (!req.isAuth) {
            throw new Error("Authorization Denied");
        }
        // Create an Event
        const event = new Event({
            title: args.eventInput.title,
            description: args.eventInput.description,
            price: args.eventInput.price,
            date: new Date(args.eventInput.date),
            creator: req.userId
        });

        let createdEvent;
        try {
            // Save Event to Database
            const result = await event.save();
            createdEvent = tranformEvent(result);
            const creator = await User.findById(req.userId);
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
    }
};
