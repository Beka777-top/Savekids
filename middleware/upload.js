const express = require('express');
const multer = require('multer');
const cors = require('cors');
const path = require('path');
const app = express();

app.use(cors());
app.use('/uploads', express.static('uploads'));

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    const uniqueName = Date.now() + path.extname(file.originalname);
    cb(null, uniqueName);
  }
});

const upload = multer({ storage });

app.post('/upload', upload.single('profileImage'), (req, res) => {
  if (!req.file) return res.status(400).send('Файл жоқ');
  res.send({ filename: req.file.filename });
});

app.listen(3000, () => {
  console.log('Server started on http://localhost:3000');
});
