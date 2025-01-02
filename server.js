const express = require('express');
const mongoose = require('mongoose');
const cors= require('cors');
require('dotenv').config();
const userRoutes = require('./src/routes/user');
const workroutes = require('./src/routes/work');
const app = express();

app.use(express.json());
app.use(cors());

mongoose.connect(process.env.DATABASE_URL)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.log('Error connecting to MongoDB', err));

app.use('/api/users', userRoutes); 
app.use('/api/work',workroutes);

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
