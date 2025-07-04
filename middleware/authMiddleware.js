const jwt = require('jsonwebtoken');
const User = require('../model/user');
// exports.verifyToken = (req, res, next) => {
//   const token = req.headers.authorization?.split(" ")[1];
//   if (!token) return res.status(401).json({ message: "No token provided" });
//   try {
//     const decoded = jwt.verify(token, process.env.JWT_SECRET);
//     req.user = { id: decoded.id };
//     next();
//   } catch (err) {
//     return res.status(401).json({ message: "Invalid token" });
//   }
// };



exports.requireLogin = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'No token provided' });
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);
    if (!user) return res.status(401).json({ message: 'User not found' });
    req.user = user;
    console.log("Authenticated user:", req.user);
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Invalid token' });
  }
};
// exports.requireLogin = (req, res, next) => {
//   if (!req.user) {
//     return res.status(401).json({ message: 'Authentication required' });
//   }
//   next();
// };