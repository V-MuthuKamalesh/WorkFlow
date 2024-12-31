const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();
const userRoutes = require('./src/routes/user');

const app = express();

app.use(express.json());

mongoose.connect(process.env.DATABASE_URL)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.log('Error connecting to MongoDB', err));

app.use('/api/users', userRoutes); 

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
