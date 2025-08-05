const express = require('express');
const router = express.Router();
const authController = require('../controller/authController');

// ✅ Тіркелу
router.post('/register', authController.register);

// ✅ Кіру
router.post('/login', authController.login);

module.exports = router;
