const { User } = require('../models/schema'); 
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const { JWT_SECRET, SALT_ROUNDS } = process.env;
exports.findUserByEmail = async (email) => {
  try {
    return await User.findOne({ email });
  } catch (error) {
    throw new Error('Error finding user');
  }  
};

exports.findUserByUserName = async (username) => {
  try {
    return await User.findOne({ username });
  } catch (error) {
    throw new Error('Error finding user');
  }  
};

exports.createUser = async (userData) => {
  try {
    const newUser = new User(userData);
    await newUser.save();
    return newUser;
  } catch (error) {
    throw new Error('Error creating user');
  }
};

exports.sendPasswordResetEmail = async (email) => {
  const user = await User.findOne({ email });
  if (!user) {
    const error = new Error('User not found');
    error.status = 404;
    throw error;
  }

  const resetToken = jwt.sign({ id: user._id, email: user.email }, JWT_SECRET, { expiresIn: '1h' });
  const resetLink = `http://localhost:3000/reset-password?token=${resetToken}`;
  
  const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'Password Reset Request',
    html: `
      <div style="font-family: Arial, sans-serif; text-align: center; max-width: 600px; margin: auto; padding: 20px; background-color: #f9f9f9;">
        <h2>Password Reset</h2>
        <p>Click <a href="${resetLink}" style="color: #007bff;">here</a> to reset your password. This link will expire in 1 hour.</p>
        <small>If you did not request this email, you can safely ignore it.</small>
      </div>
    `,
  });
};

exports.resetPassword = async (token, newPassword) => {
  let decoded;
  try {
    decoded = jwt.verify(token, JWT_SECRET);
  } catch (error) {
    error.status = 401;
    throw new Error('Invalid or expired token');
  }

  const hashedPassword = await bcrypt.hash(newPassword, Number(SALT_ROUNDS));
  await User.findByIdAndUpdate(
    decoded.id, 
    { password: hashedPassword }, 
    { new: true }
  );
};

exports.getAllUsers = async () => {
  try {
    return await User.find(); 
  } catch (error) {
    throw new Error('Error fetching users');
  }
};