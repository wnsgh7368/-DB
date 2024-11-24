const asyncHandler = require("express-async-handler");
const bcrypt = require("bcrypt");


const dbConnect = require('../config/dbConnect');
const crypto = require('crypto'); // npm i crypto
require("dotenv").config();
const jwt = require("jsonwebtoken");
const jwtSecret = process.env.JWT_SECRET;  // npm i jsonwebtoken

//@desc Get login page
//@route GET /
const getLogin = (req, res) => {
  res.render("home");
};  

const getRegister = (req, res) => {
  res.render("register");
};
//@desc Login user
//@route POST /
const loginUser = asyncHandler(async (req, res) => {
  const { username, password } = req.body;
  console.log(username);

  const pw = crypto.createHash('sha256').update(password).digest('hex');
  dbConnect.query('SELECT username FROM Users WHERE username = ? AND password = ?', [username, pw], function(error, results) {
    if (error) throw new Error("Users not read");
    if (results.length > 0) {       // db에서의 반환값이 있으면 로그인 성공
      console.log(results);
      //res.status(200).send("User 있음");
      const token = jwt.sign({ id: results.username }, jwtSecret);
      res.cookie("token", token, { httpOnly: true });
      res.redirect("/contacts");
    } else {        
      console.log('User 없음');     
    }            
  });
});

// @desc Logout
// @route GET /logout
const logout = (req, res) => {
  console.log('logout');  
  res.clearCookie("token");
  res.redirect("/");
};

const registerUser = asyncHandler(async (req, res) => {
  const { username, password, password2 } = req.body;
  if (password === password2) {
    const hashedPassword = crypto.createHash('sha256').update(password).digest('hex');
    
    dbConnect.query(
      'INSERT INTO Users (username, password) VALUES (?, ?)',
      [username, hashedPassword],
      function(error, results) {
        if (error) {
          console.error('Register error:', error);
          res.send("Register Failed");
          return;
        }
        res.status(201).json({ message: "Register successful" ,user: {username: username, password: hashedPassword}});
      }
    );
  } else {
    res.send("Register Failed: Passwords do not match");
  }
});


module.exports = { getRegister, registerUser, getLogin, loginUser, logout };
