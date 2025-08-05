const express = require('express');
const router = express.Router();
const multer = require('multer');
const pool = require('../config/db');
const verifyToken = require('../middleware/verifyToken');
const {
  postRegis,
  getAllPosts,
  deletePost,
  handleLike,
  getLikes,
  addComment,
  getComments
} = require('../controller/postController');

// 📁 Файлдарды сақтау
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads'),
  filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname),
});
const upload = multer({ storage });

// 📌 Пост қосу
router.post('/upload', verifyToken, upload.single('image'), postRegis);

// 📌 Барлық посттар
router.get('/', verifyToken, getAllPosts);

// 📌 Постты өшіру
router.delete('/:postId', verifyToken, deletePost);

// 📌 Лайк қосу немесе өшіру
router.post('/:postId/like', verifyToken, handleLike);

// 📌 Посттағы лайктар санын алу
router.get('/:postId/likes', verifyToken, getLikes);

// 📌 Лайкты тексеру (осы қолданушы лайк басқан ба)
router.get('/:postId/likes/check', verifyToken, async (req, res) => {
  try {
    const { postId } = req.params;
    const userId = req.user.id;

    const result = await pool.query(
      'SELECT 1 FROM likes WHERE post_id = $1 AND user_id = $2',
      [postId, userId]
    );

    res.json({ liked: result.rows.length > 0 });
  } catch (error) {
    console.error('Лайкты тексеру қатесі:', error.message);
    res.status(500).json({ error: 'Сервер қатесі' });
  }
});   

// 📌 Комментарий қосу
router.post('/:postId/comment', verifyToken, addComment);

// 📌 Комментарийлерді алу
router.get('/:postId/comments', verifyToken, getComments);

module.exports = router;
