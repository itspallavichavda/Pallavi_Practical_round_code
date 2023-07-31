
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');

const signUp = async (req, res) => {
  try {
    const { username, password, conPassword } = req.body;

    // Check if the username already exists
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(409).json({ error: 'Username already exists' });
    }

    if (password == conPassword) {


      // Hashing the password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      const newUser = new User({ username, password: hashedPassword });
      await newUser.save();

      res.status(201).json({ message: 'User created successfully' });
    }
    else {
      res.status(400).json({ message: 'Password and Confirm Password not matched' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
};

const signIn = async (req, res) => {
  try {
    const { username, password } = req.body;

    const user = await User.findOne({ username });
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Generate a JWT token 
    // It will expire after 1 hour
    const token = jwt.sign({ user: { id: user._id, username: user.username } }, 'JWT_SECRET_KEY', {
      expiresIn: '1h',
    });    

    res.json({ message: 'You have successfully signIn', token: token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'error' });
  }
};


module.exports = {
  signUp,
  signIn,
};
