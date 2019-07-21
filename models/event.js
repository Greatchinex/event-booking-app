import mongoose from "mongoose";

const Schema = mongoose.Schema;

const eventSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    date: {
        type: Date,
        required: true
    },
    creator: {
        type: Schema.Types.ObjectId, // Refrencing the graphql schema for created events
        ref: "User" // Refrencing the Users Model.so as to who created a particular event
    }
});

export default mongoose.model("Event", eventSchema);
