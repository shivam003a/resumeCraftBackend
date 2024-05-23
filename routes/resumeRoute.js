const express = require("express");
const router = express.Router();
const checkAuth = require("../middleware/auth");
const resume = require("../controllers/resumeController");

router.post('/download', checkAuth, resume);

module.exports = router;