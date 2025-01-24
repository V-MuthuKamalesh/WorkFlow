const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];
    console.log(token);
    if (!token) {
        return res.status(401).json({ message: 'Access denied. No token provided.' });
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (err) {
        return res.status(403).json({ message: 'Invalid or expired token.' });
    }
};

const socketAuthMiddleware = (socket, next) => {
    const token = socket.handshake.auth?.token;
    if (!token) {
        return next(new Error('Access denied. No token provided.'));
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        socket.userId = decoded.userId;
        next(); 
    } catch (err) {
        return next(new Error('Invalid or expired token.'));
    }
};

module.exports = { authMiddleware, socketAuthMiddleware };
