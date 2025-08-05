const express = require('express');
const router = express.Router();
const db = require('../config/db');
const jwt = require('jsonwebtoken');

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

// Профильді алу
router.get('/settings', verifyToken, (req, res) => {
  const id = req.userId;
  db.query('SELECT name, photo FROM users WHERE id=?', [id], (err, results) => {
    if (err) return res.status(500).json({ error: err });
    res.json(results[0]);
  });
});

// Профильді өзгерту
router.put('/settings', verifyToken, (req, res) => {
  const id = req.userId;
  const { name, email, password, photo } = req.body;

  db.query(
    'UPDATE users SET name=?, email=?, password=?, photo=? WHERE id=?',
    [name, email, password, photo, id],
    (err) => {
      if (err) return res.status(500).json({ error: err });
      res.json({ success: true, message: "Өзгерістер сақталды ✅" });
    }
  );
});

module.exports = router;
