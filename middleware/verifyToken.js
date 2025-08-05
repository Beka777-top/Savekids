const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];

  if (!authHeader) {
    return res.status(403).json({ error: "Токен берілмеген" });
  }

  const token = authHeader.split(' ')[1]; // "Bearer <token>"

  if (!token) {
    return res.status(403).json({ error: "Токен табылмады" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // кейін req.user.id деп қолданамыз
    next();
  } catch (err) {
    return res.status(401).json({ error: "Токен жарамсыз" });
  }
};

module.exports = verifyToken;
