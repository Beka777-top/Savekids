const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const authRoutes = require('./routes/authRoutes');
const postRoutes = require('./routes/postRoutes');
const path = require('path');
const settingsRoutes = require('./routes/settingsRoutes');


dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads'))); // суреттерді көрсету үшін

app.use('/api/auth', authRoutes); // логин/регистрация үшін
app.use('/api', postRoutes);      // посттарға арналған маршруттар
app.use('/api', settingsRoutes);  // settings үшін


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server started on http://localhost:${PORT}`);
});
