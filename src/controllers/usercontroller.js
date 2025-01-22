const userService = require('../services/userservice');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

exports.signup = async (req, res) => {
  try {
    const { email, password, fullname} = req.body;
    const user = await userService.findUserByEmail(email);
    if (user) {
      return res.status(400).json({ message: 'User already found!' });
    }
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await userService.createUser({
      email,
      password: hashedPassword,
      fullname
    });
    
    res.status(201).json({ message: 'User created successfully', user: newUser });
    
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Something went wrong!' });
  }
};

exports.email = async (req, res) => {
  try {
    const { email} = req.body;
    const user = await userService.findUserByEmail(email);
    if (user) {
      return res.status(409).json({ message: 'User already found!' });
    }
    res.status(200).json({ message: 'User can be created successfully' });
    
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

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '3h' });
    // console.log(token);
    res.status(200).json({ message: 'Login successful', token,userName:user.fullname ,userId:user._id});
  
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Something went wrong!' });
  }
};

exports.OAuth = async (req, res) => {
  try {
    const { email,name, picture} = req.body;
    const password = "bxhjvcjbkjhbgfncdxgcvhbjkn,mb vcdgfsxvcb";
    // console.log(email,name,password);
    let user = await userService.findUserByEmail(email);
    if (!user) {
      const hashedPassword = await bcrypt.hash(password, 10);
      user = await userService.createUser({
        email,
        password: hashedPassword,
        fullname:name,
        imgUrl: picture ,
      });
    }

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '3h' });
    // console.log(token);
    res.status(200).json({ message: 'Login successful', token,userName:user.fullname,userId:user._id });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Something went wrong!' });
  }
};

exports.verifyToken = (req, res, next) => {
  const {token} = req.body;
  if (!token) {
    return res.status(401).json({ message: 'No token provided' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.userId;
    res.status(200).json({message:'Valid Token'});
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ message: 'Token expired' });
    }
    return res.status(401).json({ message: 'Invalid token' });
  }
};

exports.sendPasswordResetEmail = async (req, res) => {
  try {
    const { email } = req.body;
    await userService.sendPasswordResetEmail(email);
    res.status(200).json({ message: 'Password reset email sent' });
  } catch (error) {
    console.error(error);
    res.status(error.status || 500).json({ message: error.message || 'Something went wrong' });
  }
};

exports.isUserWithEmailExists = async (req, res) => {
  try {
    const { email, role, workspaceId, adminId } = req.body;
    await userService.isUserWithEmailExists(email);
    await userService.sendInviteMemberRequestEmail(email, role, workspaceId, adminId);
    res.status(200).json({ message: 'Invite email sent' });
  } catch (error) {
    console.error(error);
    res.status(error.status || 500).json({ message:'User with given Email is not a user of Work Flow' });
  }
};

exports.sendMessage = async (req, res) => {
  try {
    const { userId, message } = req.body;
    await userService.sendMessage(userId, message);
    res.status(200).json({ message: 'Message Sent' });
  } catch (error) {
    console.error(error);
    res.status(error.status || 500).json({ message:'User with given Email is not a user of Work Flow' });
  }
};

exports.addMemberToWorkspace = async (req, res) => {
  try {
    const { token } = req.body;
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const {workspaceId, userId, adminId, role} = decoded;
    await userService.addMemberToWorkspace(workspaceId, userId, adminId, role);
    res.status(200).json({ message: 'Invite email sent' });
  } catch (error) {
    console.error(error);
    res.status(error.status || 500).json({ message:'User with given Email is not a user of Work Flow' });
  }
};

exports.removeMemberToWorkspace = async (id, userId, token) => {
  try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const adminId = decoded._id;
      const response = await workspaceService.removeMember(id, userId, adminId);
      return response;
  } catch (err) {
      console.log('Failed to add member to workspace: ' + err.message);
  }
}

exports.resetPassword = async (req, res) => {
  try {
    const { token, newPassword } = req.body;
    await userService.resetPassword(token, newPassword);
    res.status(200).json({ message: 'Password updated successfully' });
  } catch (error) {
    console.error(error);
    res.status(error.status || 500).json({ message: error.message || 'Invalid or expired token' });
  }
};

exports.getAllUsers = async (req, res) => {
  try {
    const users = await userService.getAllUsers(); 
    res.status(200).json(users); 
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Something went wrong!' });
  }
};

exports.getUserDetails = async (req, res) => {
  try {
    const {userId}=req.query;
    const users = await userService.getUserDetails(userId); 
    res.status(200).json(users); 
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Something went wrong!' });
  }
};

exports.updateUser = async (req, res) => {
  try {
    const {userId, userData}=req.body;
    const users = await userService.updateUser(userId, userData); 
    res.status(200).json(users); 
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Something went wrong!' });
  }
};

exports.checkRole = async (req, res) => {
  try {
    const { workspaceId, userId } = req.body;
    const role = await userService.checkRole(workspaceId, userId);
    res.status(200).json(role);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error occured!' });
  }
}