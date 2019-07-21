import Event from "../../models/event";
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
            createdEvent = tranformEvent(result);
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
    }
};
