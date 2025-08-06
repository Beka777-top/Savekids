const express = require('express');
const router = express.Router();
const pool = require('../config/db');
const bcrypt = require('bcrypt');

// 🔐 Ортақ middleware (auth тексеру)
const authMiddleware = require('../middleware/authMiddleware');

// 🔄 Аты өзгерту
router.put('/name', authMiddleware, async (req, res) => {
  const { name } = req.body;
  const userId = req.user.id;

  try {
    await pool.query('UPDATE users SET username = $1 WHERE id = $2', [name, userId]);
    res.json({ message: 'Атыңыз жаңартылды' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Қате орын алды' });
  }
});

// 🔑 Құпиясөз өзгерту
router.put('/password', authMiddleware, async (req, res) => {
  const { password } = req.body;
  const userId = req.user.id;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    await pool.query('UPDATE users SET password = $1 WHERE id = $2', [hashedPassword, userId]);
    res.json({ message: 'Құпиясөз жаңартылды' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Қате орын алды' });
  }
});

// 🖼 Фото жаңарту
router.put('/photo', authMiddleware, async (req, res) => {
  const { photo } = req.body;
  const userId = req.user.id;

  try {
    await pool.query('UPDATE users SET photo = $1 WHERE id = $2', [photo, userId]);
    res.json({ message: 'Фото жаңартылды' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Қате орын алды' });
  }
});

// ❌ Аккаунтты өшіру
router.delete('/delete', authMiddleware, async (req, res) => {
  const userId = req.user.id;

  try {
    await pool.query('DELETE FROM users WHERE id = $1', [userId]);
    res.json({ message: 'Аккаунт өшірілді' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Қате орын алды' });
  }
});

module.exports = router;
