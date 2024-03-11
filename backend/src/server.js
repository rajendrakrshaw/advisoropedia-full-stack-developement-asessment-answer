const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const config = require('./config'); // Import the configuration file

const app = express();
const PORT = process.env.PORT || 3001;

// Connect to MongoDB (replace 'your_mongodb_uri' with your actual MongoDB connection string)
mongoose.connect('mongodb://localhost:27017/social_media', { useNewUrlParser: true, useUnifiedTopology: true });

// Define MongoDB schema and model for users
const userSchema = new mongoose.Schema({
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true },
});


const User = mongoose.model('Users', userSchema);


const postSchema = new mongoose.Schema({
  title: { type: String, required: true },
  body: { type: String, required: true },
  // You can add more fields as needed
});

const Post = mongoose.model('posts', postSchema);


// Authentication middleware
const authenticate = (req, res, next) => {
  console.log("hey");
  const token = req.header('Authorization');

  console.log('Received token:', token);

  if (!token) {
    return next({ status: 401, message: 'Unauthorized' });
  }

  verifyToken(token, (err, decoded) => {
    if (err) {
      console.error(err);
      return next({ status: 401, message: 'Token is not valid' });
    }

    console.log('Decoded token:', decoded);
    req.user = decoded.userId;
    next();
  });
};

const verifyToken = (token, callback) => {
  jwt.verify(token.replace('Bearer ', ''), config.jwtSecret, callback);
};




app.use(cors());
app.use(express.json());

// Signup endpoint

app.post('/signup', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    // Hash password securely
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user
    const newUser = new User({
      email,
      password: hashedPassword,
    });

    // Save user to the database
    await newUser.save();

    // Generate JWT token
    const token = jwt.sign({ userId: newUser._id }, 'your_secret_key', { expiresIn: '10m' });

    res.json({ success: true, message: 'User registered successfully', token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Login endpoint

// app.post('/signup', async (req, res) => {
//   try {
//     const { email, password } = req.body;

//     // Validate input
//     if (!email || !password) {
//       return res.status(400).json({ error: 'All fields are required' });
//     }

//     // Check if the email already exists
//     const existingUser = await User.findOne({ email });

//     if (existingUser) {
//       return res.status(400).json({ error: 'Email already exists' });
//     }

//     // Hash password securely
//     const hashedPassword = await bcrypt.hash(password, 10);

//     // Create a new user
//     const newUser = new User({
//       email,
//       password: hashedPassword,
//     });

//     // Save user to the database
//     await newUser.save();

//     // Generate JWT token
//     const token = jwt.sign({ userId: newUser._id }, process.env.JWT_SECRET, { expiresIn: '10m' });

//     res.json({ success: true, message: 'User registered successfully', token });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: 'Internal Server Error' });
//   }
// });


app.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({ error: 'Username and password are required' });
    }

    // Find the user by username
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({ error: 'Invalid username or password' });
    }

    // Compare passwords
    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return res.status(401).json({ error: 'Invalid username or password' });
    }

    // Generate JWT token
    const token = jwt.sign({ userId: user._id }, 'your_secret_key', { expiresIn: '1h' });

    res.json({ success: true, message: 'Login successful', token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


// Paginated Posts API endpoint
app.get('/posts', async (req, res) => {
  const { page = 1, limit = 10 } = req.query;

  try {
    const posts = await Post.find()
      .skip((page - 1) * limit)
      .limit(limit)
      .exec();

    res.json(posts);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Create a new post endpoint
app.post('/posts',  async (req, res) => {
  try {
    const { title, body } = req.body;

    // Validate input
    if (!title || !body) {
      return res.status(400).json({ error: 'Title and body are required' });
    }

    // Create a new post
    const newPost = new Post({
      title,
      body,
    });

    // Save the post to the database
    await newPost.save();

    res.json({ success: true, message: 'Post created successfully', post: newPost });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});
// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
