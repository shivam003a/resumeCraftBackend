// importing dependencies
const express = require("express");
const dotenv = require("dotenv");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const resumeRoutes = require("./routes/resumeRoute");
const actionRoutes = require('./routes/actionsRoute')

// instance of express
const app = express();
dotenv.config();

const PORT = process.env.PORT || 5000;

// middlewares
app.use(express.json());
app.use(express.urlencoded({
    extended: true
}));
app.use(cors({
    origin: process.env.CORS_ORIGIN,
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true
}))
app.use(cookieParser({
    httpOnly: true,
    secure: true,
    sameSite: 'none'
}));
// TODO: CORS

app.get("/", (req, res)=>{
    res.status(200).json({
        body: `${process.env.DB_URL}`
    })
})


// routes
app.use("/api/auth", authRoutes);
app.use("/api/resume", resumeRoutes);
app.use("/api/set", actionRoutes)


// listening to server
app.listen(PORT, async ()=>{
    try{
        await connectDB();
        console.log(`Server Started: ${PORT}`);

    }catch(e){
        console.error('Error connecting MongoDB:', e.message);
        process.exit(1);
    }
})