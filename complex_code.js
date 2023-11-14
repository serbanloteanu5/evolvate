/* filename: complex_code.js
   content: This code is a complex implementation of a task management system.
            It includes functionalities like creating tasks, assigning them to users,
            setting due dates, adding comments, and tracking progress. It also handles
            user authentication and authorization using JSON Web Tokens (JWT). */

// Importing required packages
const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// Creating Express app
const app = express();
app.use(express.json());

// Connecting to MongoDB database
mongoose.connect('mongodb://localhost/task_management_system', { useNewUrlParser: true })
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('Failed to connect to MongoDB: ', err));

// Defining data models using Mongoose Schema
const userSchema = new mongoose.Schema({
  name: String,
  email: {
    type: String,
    unique: true,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  role: {
    type: String,
    enum: ['admin', 'user'],
    default: 'user'
  }
});

const taskSchema = new mongoose.Schema({
  title: String,
  description: String,
  assignee: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  dueDate: Date,
  comments: [{
    text: String,
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }
  }],
  progress: {
    type: Number,
    min: 0,
    max: 100,
    default: 0
  }
});

// Creating models based on the schemas
const User = mongoose.model('User', userSchema);
const Task = mongoose.model('Task', taskSchema);

// User Registration API
app.post('/api/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
      name,
      email,
      password: hashedPassword
    });

    await user.save();
    res.status(201).send('User registered successfully!');
  } catch (error) {
    console.error('Failed to register user: ', error);
    res.status(500).send('Internal Server Error');
  }
});

// User Login API
app.post('/api/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).send('User not found');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    
    if (!isPasswordValid) {
      return res.status(401).send('Invalid password');
    }

    const token = jwt.sign({ id: user._id, email: user.email }, 'secret_key', { expiresIn: '1h' });
    res.status(200).json({ token });
  } catch (error) {
    console.error('Failed to login user: ', error);
    res.status(500).send('Internal Server Error');
  }
});

// Task Creation API (requires authentication)
app.post('/api/tasks', authenticateUser, async (req, res) => {
  try {
    const { title, description, assignee, dueDate } = req.body;
    const task = new Task({
      title,
      description,
      assignee,
      dueDate
    });

    await task.save();
    res.status(201).send('Task created successfully');
  } catch (error) {
    console.error('Failed to create task: ', error);
    res.status(500).send('Internal Server Error');
  }
});

// Task Listing API (requires authentication)
app.get('/api/tasks', authenticateUser, async (req, res) => {
  try {
    const tasks = await Task.find().populate('assignee', 'name email');
    res.status(200).json(tasks);
  } catch (error) {
    console.error('Failed to fetch tasks: ', error);
    res.status(500).send('Internal Server Error');
  }
});

// Middleware to authenticate user using JWT
function authenticateUser(req, res, next) {
  const token = req.header('Authorization');
  if (!token) {
    return res.status(401).send('Authorization token not found');
  }

  try {
    const decoded = jwt.verify(token, 'secret_key');
    req.user = decoded;
    next();
  } catch (error) {
    console.error('Failed to authenticate user: ', error);
    res.status(403).send('Forbidden');
  }
}

// Starting the server
app.listen(3000, () => console.log('Server listening on port 3000'));