const userService = require('../services/userservice');
const { OAuth2Client } = require("google-auth-library");
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const crypto = require('crypto');

const oauth2Client = new OAuth2Client({
  clientId: process.env.GOOGLE_CLIENT_ID,
});

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

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '10h' });
    // console.log(token);
    res.status(200).json({ message: 'Login successful', token,userName:user.fullname ,userId:user._id});
  
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Something went wrong!' });
  }
};

exports.OAuth = async (req, res) => {
  try {
    const { accessToken } = req.body;
    const data = await oauth2Client.getTokenInfo(accessToken);
    console.log(data);
    let user = await userService.findUserByEmail(data.email);
    if (!user) {
      const password = crypto.randomBytes(32).toString('hex');
      const hashedPassword = await bcrypt.hash(password, 10);
      user = await userService.createUser({
        email: data.email,
        password: hashedPassword,
        fullname:data.name,
        imgUrl: data.picture ,
      });
    }

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '10h' });
    // console.log(token);
    res.status(200).json({ message: 'Login successful', token,userName:user.fullname,userId:user._id });
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

exports.verifyToken = (req, res) => {
  res.status(200).json({message:'Valid Token'});
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
    const response = await userService.sendInviteMemberRequestEmail(email, role, workspaceId, adminId);
    if(response){ return res.status(409).json({message:"User Already Member"});}
    else {return res.status(200).json({ message: 'Invite email sent' });}
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
    const { workspaceId, userId } = req.query;
    const role = await userService.checkRole(workspaceId, userId);
    res.status(200).json(role);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error occured!' });
  }
}

exports.addMemberToWorkspace = async (req, res, io) => {
  try {
    const { token } = req.body;
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const {workspaceId, userId, adminId, role} = decoded;
    const data = await userService.addMemberToWorkspace(workspaceId, userId, adminId, role);
    io.emit("memberAdded",data);
    res.status(200).json({ message: 'Invite email sent' });
  } catch (error) {
    console.error(error);
    res.status(error.status || 500).json({ message:'User with given Email is not a user of Work Flow' });
  }
};

exports.removeMemberToWorkspace = async (req, res) => {
  try {
      const { workspaceId, userId } = req.query ;
      const adminId = req.userId;
      const response = await userService.removeMember(workspaceId, userId, adminId);
      res.status(200).json({message:response});
  } catch (err) {
      console.log('Failed to remove member to workspace: ' + err.message);
  }
}

exports.promote = async (req, res) => {
  try {
      const { workspaceId, userId } = req.body ;
      const response = await userService.promote(workspaceId, userId);
      res.status(200).json({message:response});
  } catch (err) {
      console.log('Failed to promote member to workspace: ' + err.message);
  }
}

exports.dePromote = async (req, res) => {
  try {
      const { workspaceId, userId } = req.body ;
      const response = await userService.dePromote(workspaceId, userId);
      res.status(200).json({message:response});
  } catch (err) {
      console.log('Failed to promote member to workspace: ' + err.message);
  }
}