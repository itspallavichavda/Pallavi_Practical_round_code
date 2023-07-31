
const express = require('express');
const authController = require('../controllers/authController');

const router = express.Router();

// authentication routes
router.post('/signup', authController.signUp);
router.post('/signin', authController.signIn);

module.exports = router;
