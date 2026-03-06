const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const { register, login, me } = require("../controllers/authController");

req.post('/register',register);
req.post('/login',login);

req.get('/me',authMiddleware,me);

module.exports = router;

