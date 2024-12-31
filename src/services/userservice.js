const { User } = require('../models/schema'); 
exports.findUserByEmail = async (email) => {
  try {
    return await User.findOne({ email });
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
