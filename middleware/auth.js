const jwt = require('jsonwebtoken');
const User = require('../models/userSchema');

const checkAuth = async (req, res, next) => {
    const jwtToken = req.cookies.resumeToken;

    // check if token exist, if no, return
    if (!jwtToken) {
        return res.status(400).json({
            success: false,
            msg: "JWT error: token not found"
        })
    }

    try {
        // if token exist, verify token
        const isTokenValid = await jwt.verify(jwtToken, process.env.JWT_SECRET);

        // if invalid token, return
        if (!isTokenValid) {
            return res.status(400).json({
                success: false,
                msg: "JWT error: invalid token"
            })
        }

        // if token valid, check if token exist in db
        const isTokenExist = await User.findOne({
            email: isTokenValid.email,
            token: jwtToken
        });

        // if token does not exist, return
        if (!isTokenExist) {
            throw new Error("Token Error: not found")
        }

        req.user = isTokenValid;
        next();

    } catch (e) {
        res.status(500).json({
            success: false,
            msg: e.message || "Internal Server Error"
        })
    }
}

module.exports = checkAuth;