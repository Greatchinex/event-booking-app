import bcrypt from "bcryptjs";

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
            };
        } catch (err) {
            throw err;
        }
    }
};
