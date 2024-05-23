const User = require('../models/userSchema')

exports.skills = async (req, res) => {
    const { skillsArray } = req.body;
    let updatedSkillsArray = skillsArray.slice(0, 12)

    try {
        if (skillsArray.length === 0) {
            return res.status(400).json({
                success: false,
                msg: "inclue atleast 1 skill"
            })
        }

        const skills = await User.findByIdAndUpdate(req.user.id, {
            $set: { skills: updatedSkillsArray }
        }, { new: true }).select('-password').select('-token')

        res.status(200).json({
            success: true,
            msg: "skills updated",
            body: skills
        })

    } catch (e) {
        res.json({
            success: false,
            msg: e.message || "Internal Server Error"
        })
    }
}

exports.basic = async (req, res) => {
    const { basicDetail, codingDetails } = req.body;
    const { mobile, linkedin } = basicDetail;

    try {
        if (!mobile || !linkedin) {
            return res.status(400).json({
                success: false,
                msg: "fields can't be empty"
            })
        }
        if (codingDetails.length === 0) {
            return res.status(400).json({
                success: false,
                msg: "fields can't be empty"
            })
        }

        const basic = await User.findByIdAndUpdate(req.user.id, {
            $set: {
                mobile,
                linkedin,
                codingDetails
            }
        }, { new: true }).select('-password').select('-token')

        res.status(200).json({
            success: true,
            msg: "basic details updated",
            body: basic
        })

    } catch (e) {
        res.json({
            success: false,
            msg: e.message || "Internal Server Error"
        })
    }
}


exports.certificates = async (req, res) => {
    const { certificateDetails } = req.body;

    try {
        if (certificateDetails.length === 0) {
            return res.status(400).json({
                success: false,
                msg: "fields can't be empty"
            })
        }

        const certificates = await User.findByIdAndUpdate(req.user.id, {
            $set: {
                certificateDetails
            }
        }, { new: true }).select('-password').select('-token')

        res.status(200).json({
            success: true,
            msg: "certificates details updated",
            body: certificateDetails
        })

    } catch (e) {
        res.json({
            success: false,
            msg: e.message || "Internal Server Error"
        })
    }
}

exports.education = async (req, res) => {
    const { eduDetails } = req.body;

    try {
        if (eduDetails.length === 0) {
            return res.status(400).json({
                success: false,
                msg: "fields can't be empty"
            })
        }

        const education = await User.findByIdAndUpdate(req.user.id, {
            $set: {
                eduDetails
            }
        }, { new: true }).select('-password').select('-token')

        res.status(200).json({
            success: true,
            msg: "education details updated",
            body: education
        })

    } catch (e) {
        res.json({
            success: false,
            msg: e.message || "Internal Server Error"
        })
    }
}

exports.projects = async (req, res)=>{
    const { pDetails } = req.body;

    try {
        if (pDetails.length === 0) {
            return res.status(400).json({
                success: false,
                msg: "fields can't be empty"
            })
        }

        const project = await User.findByIdAndUpdate(req.user.id, {
            $set: {
                pDetails
            }
        }, { new: true }).select('-password').select('-token')

        res.status(200).json({
            success: true,
            msg: "project details updated",
            body: project
        })

    } catch (e) {
        res.json({
            success: false,
            msg: e.message || "Internal Server Error"
        })
    }
}


exports.experience = async (req, res)=>{
    const { eDetails } = req.body;

    try {
        if (eDetails.length === 0) {
            return res.status(400).json({
                success: false,
                msg: "fields can't be empty"
            })
        }

        const experience = await User.findByIdAndUpdate(req.user.id, {
            $set: {
                eDetails
            }
        }, { new: true }).select('-password').select('-token')

        res.status(200).json({
            success: true,
            msg: "experience details updated",
            body: experience
        })

    } catch (e) {
        res.json({
            success: false,
            msg: e.message || "Internal Server Error"
        })
    }
}