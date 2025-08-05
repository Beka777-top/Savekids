const pool = require('../config/db');

// 📌 Жаңа пост жариялау
const postRegis = async (req, res) => {
  try {
    const { title, content } = req.body;
    const image = req.file ? req.file.filename : null;
    const user_id = req.user.id; // verifyToken ішінен

    if (!title || !user_id) {
      return res.status(400).json({ error: 'Тақырып және қолданушы керек' });
    }

    const result = await pool.query(
      'INSERT INTO posts (title, content, image, user_id) VALUES ($1, $2, $3, $4) RETURNING *',
      [title, content, image, user_id]
    );

    res.status(201).json({ message: 'Пост сәтті жарияланды', post: result.rows[0] });
  } catch (error) {
    console.error('Post жариялау қатесі:', error.message);
    res.status(500).json({ error: 'Сервер қатесі' });
  }
};

// 📌 Барлық посттарды алу
const getAllPosts = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT p.*, u.username 
      FROM posts p
      JOIN users u ON p.user_id = u.id
      ORDER BY p.id DESC
    `);
    res.json(result.rows);
  } catch (error) {
    console.error('Посттарды алу қатесі:', error.message);
    res.status(500).json({ error: 'Сервер қатесі' });
  }
};

// 📌 Постты өшіру
const deletePost = async (req, res) => {
  try {
    const { postId } = req.params;
    await pool.query('DELETE FROM posts WHERE id = $1', [postId]);
    res.json({ message: 'Пост өшірілді' });
  } catch (error) {
    console.error('Постты өшіру қатесі:', error.message);
    res.status(500).json({ error: 'Сервер қатесі' });
  }
};

// 📌 Лайк қосу/алып тастау
const handleLike = async (req, res) => {
  try {
    const { postId } = req.params;
    const userId = req.user.id;

    const existing = await pool.query(
      'SELECT * FROM likes WHERE post_id = $1 AND user_id = $2',
      [postId, userId]
    );

    if (existing.rows.length > 0) {
      await pool.query('DELETE FROM likes WHERE post_id = $1 AND user_id = $2', [postId, userId]);
      return res.json({ liked: false, message: 'Лайк алынды' });
    }

    await pool.query('INSERT INTO likes (post_id, user_id) VALUES ($1, $2)', [postId, userId]);
    res.json({ liked: true, message: 'Лайк қосылды' });
  } catch (error) {
    console.error('Лайк қатесі:', error.message);
    res.status(500).json({ error: 'Сервер қатесі' });
  }
};

// 📌 Лайктарды алу
const getLikes = async (req, res) => {
  try {
    const { postId } = req.params;
    const result = await pool.query('SELECT COUNT(*)::int AS count FROM likes WHERE post_id = $1', [postId]);
    res.json({ count: result.rows[0].count });
  } catch (error) {
    console.error('Лайктарды алу қатесі:', error.message);
    res.status(500).json({ error: 'Сервер қатесі' });
  }
};

// 📌 Комментарий қосу
const addComment = async (req, res) => {
  try {
    console.log("BODY:", req.body);
    console.log("PARAMS:", req.params);
    console.log("USER:", req.user);

    const { postId } = req.params;
    const { text } = req.body;
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ error: "Пайдаланушы табылмады" });
    }

    if (!text || text.trim() === "") {
      return res.status(400).json({ error: "Комментарий бос болмауы керек" });
    }

    const result = await pool.query(
      `INSERT INTO comments (post_id, user_id, content) 
       VALUES ($1, $2, $3) RETURNING id, content, created_at`,
      [postId, userId, text]
    );

    const userData = await pool.query(
      "SELECT username FROM users WHERE id = $1",
      [userId]
    );

    res.status(201).json({
      id: result.rows[0].id,
      content: result.rows[0].content,
      username: userData.rows[0].username,
      created_at: result.rows[0].created_at
    });
  } catch (error) {
    console.error("Комментарий қатесі:", error.message);
    res.status(500).json({ error: "Сервер қатесі", detail: error.message });
  }
};


// 📌 Комментарийлерді алу
const getComments = async (req, res) => {
  try {
    const { postId } = req.params;
    const result = await pool.query(
      `SELECT c.*, u.username 
       FROM comments c 
       JOIN users u ON c.user_id = u.id 
       WHERE c.post_id = $1 
       ORDER BY c.id DESC`,
      [postId]
    );
    res.json(result.rows);
  } catch (error) {
    console.error('Комментарийлерді алу қатесі:', error.message);
    res.status(500).json({ error: 'Сервер қатесі' });
  }
};

module.exports = {
  postRegis,
  getAllPosts,
  deletePost,
  handleLike,
  getLikes,
  addComment,
  getComments
};
