const express = require('express');
const router = express.Router();
const db = require('../config/db');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

// 🔒 Токенді тексеру
const verifyToken = (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1];
  if (!token) return res.status(403).json({ error: "Token жоқ" });

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) return res.status(401).json({ error: "Қате токен" });
    req.userId = decoded.id;
    next();
  });
};

// 📌 Профильді алу
router.get('/settings', verifyToken, (req, res) => {
  const id = req.userId;
  db.query('SELECT name, password, photo FROM users WHERE id=?', [id], (err, results) => {
    if (err) return res.status(500).json({ error: err });
    res.json(results[0]);
  });
});

// 📌 Атын өзгерту
router.put('/settings/name', verifyToken, (req, res) => {
  const id = req.userId;
  const { name } = req.body;

  db.query('UPDATE users SET name=? WHERE id=?', [name, id], (err) => {
    if (err) return res.status(500).json({ error: err });
    res.json({ success: true, message: "Атыңыз сақталды ✅" });
  });
});

// 📌 Пароль өзгерту
router.put('/settings/password', verifyToken, async (req, res) => {
  try {
    const id = req.userId;
    const { password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);

    db.query('UPDATE users SET password=? WHERE id=?', [hashedPassword, id], (err) => {
      if (err) return res.status(500).json({ error: err });
      res.json({ success: true, message: "Пароль сақталды ✅" });
    });
  } catch (err) {
    res.status(500).json({ error: "Қате: " + err.message });
  }
});

// 📌 Фото өзгерту
router.put('/settings/photo', verifyToken, (req, res) => {
  const id = req.userId;
  const { photo } = req.body; // frontend-тен фото URL келеді

  db.query('UPDATE users SET photo=? WHERE id=?', [photo, id], (err) => {
    if (err) return res.status(500).json({ error: err });
    res.json({ success: true, message: "Фото сақталды ✅" });
  });
});

module.exports = router;
