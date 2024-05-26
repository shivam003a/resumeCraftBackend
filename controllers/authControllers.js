const bcrypt = require("bcrypt")
const User = require("../models/userSchema")

exports.signup = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({
                success: false,
                msg: "Fields Can't be Empty"
            })
        }

        const isEmailExist = await User.findOne({ email });

        if (isEmailExist) {
            return res.status(400).json({
                success: false,
                msg: "User Already Registered",
            })
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const responseData = await User.create({
            name,
            email,
            password: hashedPassword
        })

        const data = responseData.toObject();
        data.password = null;

        res.status(200).json({
            success: true,
            msg: "User Registered!",
            body: data
        })

    } catch (e) {
        res.status(500).json({
            success: false,
            msg: "Internal Server Error"
        })
    }
}

exports.signin = async(req, res) => {
    try{
        const {email, password} = req.body;

        if (!email || !password) {
            return res.status(400).json({
                success: false,
                msg: "Fields Can't be Empty"
            })
        }

        const isEmailExist = await User.findOne({ email });
        return res.status(200).json({
            email : isEmailExist
        })

        if(!isEmailExist){
            return res.status(400).json({
                success: false,
                msg: "User is Not Registered"
            })
        }

        const isPassMatched = await bcrypt.compare(password, isEmailExist.password);

        if(!isPassMatched){
            return res.status(400).json({
                success: false,
                msg: "Invalid Credentials"
            })
        }

        const jwtToken = await isEmailExist.genAuthToken();


        res.cookie("resumeToken", jwtToken, {
            expires: new Date(Date.now() + 604800000),
            httpOnly: true,
            secure: true,
            sameSite: 'none'
        })

        const data = isEmailExist.toObject();
        data.password = null;
        data.token = null;

        res.status(200).json({
            success: true,
            msg: "Sigin Success",
            body: data
        })

    }catch(e){
        res.status(500).json({
            success: false,
            msg: "Internal Server Error"
        })
    }
}
exports.signout = async (req, res) => {
    try{
        const id = req.user.id;
        const loggedUser = await User.findByIdAndUpdate(id, {
            $set: {token: null}
        }, {new: true}).select('-password');

        res.clearCookie('resumeToken');

        res.status(200).json({
            success: true,
            msg: "Logged Out",
            body: loggedUser
        })

    }catch(e){
        res.status(500).json({
            success: false,
            msg: e.message || "Internal Server Error"
        })
    }
}

exports.verify = async(req, res)=>{
    res.status(200).json({
        success: true,
        msg: "verified"
    })
}