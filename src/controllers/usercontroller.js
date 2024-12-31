const userService = require('../services/userservice');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { verifyOAuthToken } = require('../services/oauthService'); 

exports.signup = async (req, res) => {
  try {
    const { email, password, fullname, oauthProvider, oauthToken } = req.body;

    if (oauthProvider && oauthToken) {
      const oauthUser = await verifyOAuthToken(oauthProvider, oauthToken);
      if (!oauthUser) {
        return res.status(400).json({ message: 'Invalid OAuth token' });
      }

      const existingUser = await userService.findUserByEmail(oauthUser.email);
      if (existingUser) {
        return res.status(409).json({ message: 'User already exists', user: existingUser });
      }

      const newUser = await userService.createUser({
        email: oauthUser.email,
        fullname: oauthUser.name,
        password: null, 
        oauthProvider,
      });

      res.status(201).json({ message: 'User created successfully', user: newUser });
    } else {
      const hashedPassword = await bcrypt.hash(password, 10);

      const newUser = await userService.createUser({
        email,
        password: hashedPassword,
        fullname,
      });
      
      res.status(201).json({ message: 'User created successfully', user: newUser });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Something went wrong!' });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password, oauthProvider, oauthToken } = req.body;

    if (oauthProvider && oauthToken) {
      const oauthUser = await verifyOAuthToken(oauthProvider, oauthToken);
      if (!oauthUser) {
        return res.status(400).json({ message: 'Invalid OAuth token' });
      }

      const user = await userService.findUserByEmail(oauthUser.email);
      if (!user) {
        return res.status(404).json({ message: 'User not found! Please sign up.' });
      }

      const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
      res.status(200).json({ message: 'Login successful', token });
    } else {
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
    }
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

exports.checkAndSignup = async (req, res) => {
  try {
    const { email} = req.body;

    const existingUser = await userService.findUserByEmail(email);
    if (existingUser) {
      return res.status(409).json({ message: 'User already exists', user: existingUser });
    }
    res.status(200).json({ message: 'User can be created'});
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Something went wrong!' });
  }
};
