const express = require('express');
const mongoose = require('mongoose');
const cors= require('cors');
require('dotenv').config();
const http = require('http');
const { Server } = require('socket.io');

const userRoutes = require('./src/routes/user');
const workRoutes = require('./src/routes/work');
// const devRoutes = require('./src/routes/dev');

const app = express();
const server = http.createServer(app); 
const io = new Server(server); 
app.use(express.json());
app.use(cors());

mongoose.connect(process.env.DATABASE_URL)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.log('Error connecting to MongoDB', err));

app.use('/api/users', userRoutes); 
app.use('/api/work', workRoutes(io)); 
// app.use('/api/dev', devRoutes(io)); 

const PORT = process.env.PORT;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
