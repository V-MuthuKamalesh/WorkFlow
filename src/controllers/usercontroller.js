const userService = require('../services/userservice');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

exports.signup = async (req, res) => {
  try {
    const { email, password, fullname} = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await userService.createUser({
      email,
      password: hashedPassword,
      fullname,
    });
    
    res.status(201).json({ message: 'User created successfully', user: newUser });
    
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Something went wrong!' });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await userService.findUserByEmail(email);
    if (!user) {
      return res.status(404).json({ message: 'User not found!' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.status(200).json({ message: 'Login successful', token });
  
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Something went wrong!' });
  }
};
exports.logout = (req, res) => {
  try {
    res.status(200).json({ message: 'Logout successful' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Something went wrong!' });
  }
};

exports.OAuth = async (req, res) => {
  try {
    const { email,name} = req.body;
    const user = await userService.findUserByEmail(email);
    if (!user) {
      const hashedPassword = await bcrypt.hash(password, 10);
      user = await userService.createUser({
        email,
        password: null,
        fullname:name,
      });
    }

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.status(200).json({ message: 'Login successful', token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Something went wrong!' });
  }
};
