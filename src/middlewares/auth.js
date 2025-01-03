const jwt = require('jsonwebtoken');
const {User} = require('../models/schema'); 

const checkAuth = async (req, res, next) => {
  try {
    const token = req.headers.authorization && req.headers.authorization.split(' ')[1];

    if (!token) {
      return res.status(401).json({ message: 'Authentication failed, no token provided' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET); 

    const user = await User.findById(decoded.userId);

    if (!user) {
      return res.status(401).json({ message: 'Authentication failed, user not found' });
    }

    req.user = user;
    if (req.user.role === 'admin') { 
      next(); 
    } else {
      return res.status(403).json({ message: 'Permission denied' });
    }
  } catch (error) {
    console.error('Error in checkAuth middleware:', error);
    return res.status(401).json({ message: 'Authentication failed, invalid token' });
  }
};

module.exports = checkAuth;
