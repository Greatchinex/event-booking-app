import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

// Middleware Function to protect Certain routes on our application
export default (req, res, next) => {
    const authHeader = req.get("Authorization");
    // If there is no "Authorization" in header the request should return an unauthorized
    if (!authHeader) {
        req.isAuth = false;
        return next();
    }
    const token = authHeader.split(" ")[1];
    // If there is no token in the header: the request should return an unauthorized
    if (!token || token === "") {
        req.isAuth = false;
        return next();
    }

    let decodedToken;
    try {
        // If there is a token
        decodedToken = jwt.verify(token, process.env.SECRET);
    } catch (err) {
        req.isAuth = false;
        return next();
    }

    if (!decodedToken) {
        req.isAuth = false;
        return next();
    }

    req.isAuth = true;
    req.userId = decodedToken.userId;
    next();
};
