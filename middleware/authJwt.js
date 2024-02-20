const jwt = require("jsonwebtoken");
const User = require("../model/userModel");
const authConfig = require("../configs/auth.config");

const verifyToken = (req, res, next) => {
    const token = req.get("Authorization")?.split("Bearer ")[1] || req.headers["x-access-token"];
    if (!token) {
        return res.status(403).json({ status: 403, message: "no token provided! Access prohibited", data: {} })
    }
    jwt.verify(token, authConfig.secret, async (err, decoded) => {
        if (err) {
            return res.status(401).json({ status: 401, message: "UnAuthorised !", data: {} })
        }
        const user = await User.findOne({ _id: decoded.id });
        const user1 = await User.findOne({ _id: decoded.id });
        if (!user && !user1) {
            return res.status(400).json({ status: 400, message: "The user that this token belongs to does not exist !", data: {} })
        }
        req.user = user || user1;
        next();
    });
};
const isAdmin = (req, res, next) => {
    const token =
        req.headers["x-access-token"] ||
        req.get("Authorization")?.split("Bearer ")[1];

    if (!token) {
        return res.status(403).json({ status: 403, message: "no token provided! Access prohibited", data: {} })
    }

    jwt.verify(token, authConfig.secret, async (err, decoded) => {
        if (err) {
            return res.status(401).json({ status: 401, message: "UnAuthorised !", data: {} })
        }

        const user = await User.findOne({ email: decoded.id });

        if (!user) {
            return res.status(400).json({ status: 400, message: "The admin that this token belongs to does not exist !", data: {} })
        }
        req.user = user;

        next();
    });
};

module.exports = {
    verifyToken,
    isAdmin,
};
