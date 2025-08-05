const pool = require('../config/db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const env = require('../config/env');
const JWT_SECRET = env.JWT_SECRET;


// ✅ Тіркелу
exports.register = async (req, res) => {
  const { username, password } = req.body;
  console.log('Registering user:', username, password);

  if (!username || !password) {
    return res.status(400).json({ message: "Жіберілген ақпарат толық емес!" });
  }

  try {
    // Парольді хештеу
    const hashedPassword = await bcrypt.hash(password, 10);

    // Қолданушыны базаға қосу
    const result = await pool.query(
      'INSERT INTO users (username, password) VALUES ($1, $2) RETURNING *',
      [username, hashedPassword]
    );

    const newUser = result.rows[0];

    // JWT жасау
    const token = jwt.sign({ id: newUser.id }, JWT_SECRET, { expiresIn: '1h' });

    return res.status(201).json({
      message: "Тіркелдіңіз!",
      token,
      user: {
        id: newUser.id,
        username: newUser.username
      }
    });
  } catch (err) {
    console.error("❌ Register қатесі:", err);
    res.status(500).json({ message: "Сервер қатесі", error: err.message, stack: err.stack });
  }
};

// ✅ Логин
exports.login = async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: "Барлық өрістерді толтырыңыз!" });
  }

  try {
    // Қолданушыны табу
    const result = await pool.query('SELECT * FROM users WHERE username = $1', [username]);
    const user = result.rows[0];

    if (!user) {
      return res.status(401).json({ message: 'Қолданушы табылмады' });
    }

    // Пароль тексеру
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Қате логин немесе құпия сөз' });
    }

    // JWT жасау
    const token = jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: '1h' });

    return res.json({
      message: "Кіру сәтті!",
      token,
      user: {
        id: user.id,
        username: user.username
      }
    });
  } catch (err) {
    console.error("❌ Login қатесі:", err);
    res.status(500).json({ message: "Сервер қатесі", error: err.message, stack: err.stack });
  }
};
