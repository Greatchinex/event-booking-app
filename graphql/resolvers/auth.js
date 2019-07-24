import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import User from "../../models/users";

// Resolvers Function
export default {
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
                // message: "Successful",
            };
        } catch (err) {
            throw err;
        }
    },
    login: async ({ email, password }) => {
        try {
            // Check if user exist in DB
            const user = await User.findOne({ email: email });
            if (!user) {
                throw new Error("Incorrect email Or Password");
            }
            // If User Exists then Compare Passwords
            const equalPassword = await bcrypt.compare(password, user.password);
            if (!equalPassword) {
                throw new Error("Incorrect email Or Password");
            }
            // Create token for user
            const token = jwt.sign({ userId: user._id }, process.env.SECRET, {
                expiresIn: "1h"
            });
            return {
                userId: user._id,
                token,
                tokenEXpiration: 1
            };
        } catch (err) {
            throw err;
        }
    }
};
