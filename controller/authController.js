const pool = require('../config/db'); // PostgreSQL connection
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// ✅ Тіркелу — клиентке username қайтарамыз
exports.register = async (req, res) => {
  try {
    const { username, password } = req.body;

    // Парольді хэштеу
    const hash = await bcrypt.hash(password, 10);

    // Дерекқорға жазу
    await pool.query(
      'INSERT INTO users (username, password) VALUES ($1, $2)',
      [username, hash]
    );

    // Клиентке username қайтарамыз
    res.json({ message: 'Тіркелу сәтті өтті', success: true, username });
  } catch (err) {
    console.error('Register error:', err);
    res.status(500).json({ message: 'Сервер қатесі', success: false });
  }
};

// ✅ Кіру — клиентке token және username қайтарамыз
exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;

    // Пайдаланушыны іздеу
    const result = await pool.query('SELECT * FROM users WHERE username = $1', [username]);

    if (result.rows.length === 0) {
      return res.status(401).json({ message: 'Пайдаланушы табылмады', success: false });
    }

    const user = result.rows[0];

    // Құпиясөз тексеру
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Қате құпия сөз', success: false });
    }

    // Token жасау
    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
      expiresIn: '24h',
    });

    // Клиентке token және username қайтарамыз
    res.json({
      success: true,
      message: 'Кіру сәтті өтті',
      token,
      username: user.username
    });

  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ message: 'Сервер қатесі', success: false });
  }
};
