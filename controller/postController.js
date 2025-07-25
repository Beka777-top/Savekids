const postRegis = (req, res) => {
  const { title } = req.body;

  if (!req.file) {
    return res.status(400).json({ message: 'Image is required' });
  }

  console.log('File uploaded:', req.file);

  res.status(200).json({
    message: 'Post created successfully',
    file: req.file.filename,
    title: title || '',
  });
};

module.exports = { postRegis };
