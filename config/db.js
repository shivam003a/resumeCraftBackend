const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();

// function: connection to db
const connectDB = async () => {
    const DB_URL = process.env.DB_URL;
    if (!DB_URL) {
        throw new Error("DB URI: NULL")
    }

    try {
        await mongoose.connect(DB_URL);
        console.log("DB Connected");

    } catch (e) {
        console.log("Connection Erorr", e.message);  
    }
}

module.exports = connectDB;