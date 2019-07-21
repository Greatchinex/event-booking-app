import mongoose from "mongoose";

const Schema = mongoose.Schema;

const userSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    createdEvents: [
        {
            type: Schema.Types.ObjectId, // Refrencing the graphql schema for created events
            ref: "Event" // Refrencing the events Model.so as to know which user created an event
        }
    ]
});

export default mongoose.model("User", userSchema);
