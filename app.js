const express = require('express');
const cors = require('cors');
require('dotenv').config();

const authRoutes = require('./Routes/authRoutes');
const postRoutes = require('./Routes/postRoutes');

const app = express();

app.use(cors());
app.use(express.json());
app.use('/uploads', express.static('uploads'));

app.use('/auth', authRoutes);
app.use('/posts', postRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
