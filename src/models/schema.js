const mongoose = require('mongoose');
const { Schema } = mongoose;

const userSchema = new Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  fullname: { type: String, required: true },
  imgUrl: { type: String },
  createdAt: { type: Date, default: Date.now }
});

const boardSchema = new Schema({
  title: { type: String, required: true },
  description: { type: String },
  createdById: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

const groupSchema = new Schema({
  title: { type: String, required: true },
  boardId: { type: mongoose.Schema.Types.ObjectId, ref: 'Board', required: true },
  items: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Item' }],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

const itemSchema = new Schema({
  title: { type: String, required: true },
  description: { type: String },
  status: { type: String },
  priority: { type: String },
  dueDate: { type: Date },
  assignedToId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  groupId: { type: mongoose.Schema.Types.ObjectId, ref: 'Group', required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

const User = mongoose.model('User', userSchema);
const Board = mongoose.model('Board', boardSchema);
const Group = mongoose.model('Group', groupSchema);
const Item = mongoose.model('Item', itemSchema);

module.exports = { User, Board, Group, Item };
