const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const cors= require('cors');
require('dotenv').config();
const http = require('http');
const { Server } = require('socket.io');
// const cronSchedule = require('./src/utils/cron');

const userRoutes = require('./src/routes/user');
const workRoutes = require('./src/routes/work');

const app = express();
const server = http.createServer(app);  
const io = new Server(server); 
app.use(express.json({limit:'50mb'}));
app.use(cors());

mongoose.connect(process.env.DATABASE_URL)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.log('Error connecting to MongoDB', err));

app.use(cookieParser());
app.use('/api/users', userRoutes); 
app.use('/api', workRoutes(io)); 

const PORT = process.env.PORT;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
