const express = require('express');
const router = express.Router();
const multer = require('multer');
const { postRegis } = require('../controller/postController');

// Сурет сақтау конфигурациясы
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads'),
  filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname)
});

const upload = multer({ storage });

// POST сұраныс жасау маршруты
router.post('/upload', upload.single('image'), postRegis);

module.exports = router;
