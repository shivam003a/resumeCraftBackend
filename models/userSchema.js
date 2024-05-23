const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        maxLength: 30,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    mobile: {
        type: String
    },
    linkedin: {
        type: String
    },
    skills: Array(String),
    codingDetails: Array({}),
    certificateDetails: Array({}),
    eduDetails: Array({}),
    pDetails: Array({}),
    eDetails: Array({}),
    token: {
        type: String
    }
}, { timestamps: true })

userSchema.methods.genAuthToken = async function () {
    const payload = {
        email: this.email,
        id: this._id
    }
    const JWT_SECRET = process.env.JWT_SECRET;

    if (!JWT_SECRET) {
        throw new Error('JWT SECRET env variable not defined or invalid');
    };

    const token = await jwt.sign(payload, JWT_SECRET, {
        expiresIn: "168h"
    });

    this.token = token;
    await this.save();
    return token;
}

const User = mongoose.model("User", userSchema);
module.exports = User;