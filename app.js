const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');

// 📌 Маршруттар
const authRoutes = require('./Routes/authRoutes');   // авторизация
const postRoutes = require('./Routes/postRoutes');   // посттар
const settingsRoutes = require('./Routes/settingsRoutes'); // баптаулар

dotenv.config();

const app = express();

// 📌 Ортақ middleware
app.use(cors());
app.use('/uploads', express.static(path.join(__dirname, 'uploads'))); // суреттерді шығару
app.use(express.json());

// 📌 Негізгі маршруттар
app.use('/api/auth', authRoutes);
app.use('/api/posts', postRoutes); 
app.use('/api/settings', settingsRoutes);

// 📌 Серверді қосу
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ Server started on http://localhost:${PORT}`);
});
