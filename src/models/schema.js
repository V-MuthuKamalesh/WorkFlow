const mongoose = require('mongoose');
const { Schema } = mongoose;

const userSchema = new Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  fullname: { type: String, required: true },
  username: { type: String, required: true, unique: true },
  imgUrl: { type: String },
  createdAt: { type: Date, default: Date.now }
});

const moduleSchema = new Schema({
  name: {
    type: String,
    enum: ['Workmanagement', 'CRM', 'Dev', 'Service'],
    required: true,
  },
  description: { type: String, default: '' },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  workspaces: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Workspace' }],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

const workspaceSchema = new Schema({
  name: { type: String, required: true },
  description: { type: String },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  members: [
    {
      userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
      role: { type: String, enum: ['admin', 'member'], default: 'member' },
    },
  ],
  boards: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Board' }],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

const boardSchema = new Schema({
  title: { type: String, required: true },
  description: { type: String },
  createdById: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  groups: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Group' }],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

const groupSchema = new Schema({
  title: { type: String, required: true },
  boardId: { type: mongoose.Schema.Types.ObjectId, ref: 'Board', required: true },
  items: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Item' }],
  contacts: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Contact' }],
  deals: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Deal' }],
  leads: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Lead' }],
  projects: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Project' }],
  sprints: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Sprint' }],
  bugs: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Bug' }],
  epics: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Epic' }],
  tickets: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Ticket' }],
  incidents: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Incident' }],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
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

const contactSchema = new Schema({
  type: { type: String, required: true },
  deals: [
    {
      dealId: { type: mongoose.Schema.Types.ObjectId, ref: 'Deal' },
      dealTitle: { type: String },
    },
  ],
  title: { type: String, required: true },
  priority: { type: String },
  phone: { type: String },
  email: { type: String },
  company: { type: String },
  dealsValue: { type: Number },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

const dealSchema = new Schema({
  stage: { type: String, required: true },
  owner: {
    _id: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    username: { type: String },
    fullname: { type: String },
  },
  dealValue: { type: Number },
  contacts: [
    {
      contactId: { type: mongoose.Schema.Types.ObjectId, ref: 'Contact' },
      contactName: { type: String },
    },
  ],
  priority: { type: String },
  dealLength: { type: Number },
  expectedCloseDate: { type: Date },
  closeProbability: { type: Number },
  forecastValue: { type: Number },
  closeDate: { type: Date },
  actualDealValue: { type: Number },
  dealCreationDate: { type: Date },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

const leadSchema = new Schema({
  status: { type: String, required: true },
  owner: {
    _id: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    username: { type: String },
    fullname: { type: String },
  },
  contact: {
    contactId: { type: mongoose.Schema.Types.ObjectId, ref: 'Contact' },
    contactName: { type: String },
  },
  company: { type: String },
  title: { type: String },
  email: { type: String },
  phone: { type: String },
  location: { type: String },
  comments: { type: String },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

const projectSchema = new Schema({
  owner: {
    _id: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    username: { type: String },
    fullname: { type: String },
  },
  priority: { type: String },
  timeline: {
    startDate: { type: Date },
    endDate: { type: Date },
  },
  opportunity: {
    dealId: { type: mongoose.Schema.Types.ObjectId, ref: 'Deal' },
    dealTitle: { type: String },
  },
  status: { type: String },
  phone: { type: String },
  email: { type: String },
  file: {
    fileId: { type: mongoose.Schema.Types.ObjectId },
    fileName: { type: String },
    filePath: { type: String },
  },
  contact: {
    contactId: { type: mongoose.Schema.Types.ObjectId, ref: 'Contact' },
    contactName: { type: String },
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

const sprintSchema = new Schema({
  sprintGoals: { type: String, required: true },
  totalEstimatedEffort: { type: Number },
  sprintProgress: { type: Number },
  activeSprint: { type: Boolean },
  sprintTimeline: {
    startDate: { type: Date },
    endDate: { type: Date },
  },
  connectedTasks: [
    {
      taskId: { type: mongoose.Schema.Types.ObjectId },
      taskTitle: { type: String },
    },
  ],
  completed: { type: Boolean },
  sprintStartDate: { type: Date },
  sprintEndDate: { type: Date },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

const bugSchema = new Schema({
  reporter: {
    _id: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    username: { type: String },
    fullname: { type: String },
  },
  priority: { type: String },
  connectedTasks: [
    {
      taskId: { type: mongoose.Schema.Types.ObjectId },
      taskTitle: { type: String },
    },
  ],
  timeUntilResolution: { type: Number },
  reportDate: { type: Date },
  developer: {
    _id: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    username: { type: String },
    fullname: { type: String },
  },
  source: { type: String },
  pictureOrVideo: {
    fileId: { type: mongoose.Schema.Types.ObjectId },
    fileName: { type: String },
    filePath: { type: String },
  },
  resolution: { type: String },
  lastUpdated: { type: Date },
  taskStatus: { type: String },
  status: { type: String },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

const epicSchema = new Schema(bugSchema.obj); 

const ticketSchema = new Schema(bugSchema.obj); 

const incidentSchema = new Schema({
  status: { type: String, required: true },
  text: { type: String },
  people: [
    {
      _id: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
      username: { type: String },
      fullname: { type: String },
    },
  ],
  dropdown: { type: String },
  date: { type: Date },
  numbers: { type: Number },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

module.exports = {
  User : mongoose.model('User', userSchema),
  Module : mongoose.model('Module', moduleSchema),
  Workspace : mongoose.model('Workspace', workspaceSchema),
  Board : mongoose.model('Board', boardSchema),
  Group : mongoose.model('Group', groupSchema),
  Item : mongoose.model('Item', itemSchema),
  Contact: mongoose.model('Contact', contactSchema),
  Deal: mongoose.model('Deal', dealSchema),
  Lead: mongoose.model('Lead', leadSchema),
  Project: mongoose.model('Project', projectSchema),
  Sprint: mongoose.model('Sprint', sprintSchema),
  Bug: mongoose.model('Bug', bugSchema),
  Epic: mongoose.model('Epic', epicSchema),
  Ticket: mongoose.model('Ticket', ticketSchema),
  Incident: mongoose.model('Incident', incidentSchema),
};

