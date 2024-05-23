const express = require("express");
const router = express.Router();
const checkAuth = require("../middleware/auth")

const {signup, signin, signout, verify} = require("../controllers/authControllers")

router.post('/signup', signup);
router.post('/signin', signin);
router.get('/signout', checkAuth, signout);
router.get('/verify', checkAuth, verify);

module.exports = router;