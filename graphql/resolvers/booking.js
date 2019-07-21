import Booking from "../../models/booking";
import Event from "../../models/event";
import { transformBooking } from "./helperFunctions";

// Resolvers Function
export default {
    bookings: async () => {
        try {
            const bookings = await Booking.find();
            return bookings.map(booking => {
                return transformBooking(booking);
            });
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
            return transformBooking(result);
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
            const event = tranformEvent(booking.event);
            // Delete Booking
            await Booking.deleteOne({ _id: args.bookingId });
            return event;
        } catch (err) {
            throw err;
        }
    }
};
