const express = require("express");
const router = express.Router();
const checkAuth = require("../middleware/auth")

const {skills, basic, certificates, education, projects, experience} = require("../controllers/actionControllers")

router.put('/skills', checkAuth, skills);
router.put('/basic', checkAuth, basic);
router.put('/certificates', checkAuth, certificates);
router.put('/education', checkAuth, education);
router.put('/projects', checkAuth, projects);
router.put('/experience', checkAuth, experience);

module.exports = router;