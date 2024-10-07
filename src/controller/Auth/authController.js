require('dotenv').config();
const fs = require('fs');
const path = require('path');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { encode } = require('querystring');

const SECRET_KEY = process.env.SECRET_KEY;
const users = JSON.parse(fs.readFileSync(path.join(__dirname, '../../../database/Users/Auth.json'), 'utf8'));

if (!SECRET_KEY) {
  throw new Error('SECRET_KEY is not defined in environment variables');
}

// Function to authenticate a user and return a JWT
const authenticateUser = (username, password) => {
  const user = users.find(user => user.username === username);

  if (user && bcrypt.compareSync(password, user.password)) {
    // If user is found and password matches, generate a token
    const token = jwt.sign({ username: user.username }, SECRET_KEY, { expiresIn: '1h' });
    return { token };
  } else {
    throw new Error('Invalid credentials');
  }
};

const getNickname = (name) => {
  const user = users.find(user => user.username === name);
  return user ? user.nickname : '';
};

// POST route for user login (authentication)
const loginUser = (req, res) => {
  const { username, password } = req.body;

  try {
    const { token } = authenticateUser(username, password);
    // Set the token in an HTTP-only cookie
    res.cookie('sessionCookie', token, { httpOnly: true, maxAge: 3600000 }); // Expires in 1 hour
    res.cookie('username', username);
    const nickname = getNickname(username);
    res.redirect(`/Home?nickname=${encodeURIComponent(nickname)}`);

    res.redirect('/Home');

  } catch (error) {
    res.status(401).json({ message: error.message });
  }
};

const getRegister = (req, res) => {
  try {
    res.sendFile(path.join(__dirname, '../../public/pages/Register/')); // Update this line to send the index.html fileFF
  } catch (err) {
    res.status(500).json({
      message: "Internal server error",
      error: err.message,
    });
  }
}

// Function to register a new user
const registerUser = (req, res) => {
  const { username, password, email, nickname } = req.body;

  // Check if the username already exists
  if (users.find(user => user.username === username || user.email === email)) {
    return res.status(400).json({ message: 'Username or Email already exists' });
  }

  // Hash the password and add the new user to the "database"
  const hashedPassword = bcrypt.hashSync(password, 8);
  users.push({ username, password: hashedPassword, email, nickname });
  fs.writeFileSync(path.join(__dirname, '../../../database/Users/Auth.json'), JSON.stringify(users, null, 2));
  console.log('User registered successfully');
  res.status(201).then(res.redirect('/'));
  // json({ message: 'User registered successfully' });
};


const logoutUser = (req, res) => {
  for (const cookie in req.cookies) {
    res.clearCookie(cookie);
  }
  res.redirect('/');
}

module.exports = {
  authenticateUser,
  loginUser,
  logoutUser,
  registerUser,
  getRegister,
  getNickname,
};
