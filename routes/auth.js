const express  = require('express');
const auth     = express.Router();
const passport = require('passport')
const bcrypt   = require('bcrypt')
const User     = require('../models/User')
const uploader = require('../configs/cloudinary')

auth.post('/signup', (req,res) => {
  const {
    username,
    password,
    email,
    name
  } = req.body

  if (!username || !password || !email) {
    // console.log('Provide username, password and email')
    res.status(400).json({message: "Provide username, password and email" });
    return;
  }
  if (password.length < 3) {
    // console.log('Please make your password at least 4 characters long for security purposes')
    res.status(400).json({
      message:
        "Please make your password at least 4 characters long for security purposes.",
    });
    return;
  }
  User.findOne({ username }, (err, foundUser) => {
    if (err) {
      // console.log('Username check went bad.')
      res.status(500).json({ message: "Username check went bad." });
      return;
    }
    if (foundUser) {
      // console.log('Username taken. Choose another one.')
      res.status(400).json({ message: "Username taken. Choose another one." });
      return;
    }
    const salt = bcrypt.genSaltSync(10);
    const hashPass = bcrypt.hashSync(password, salt);
    const aNewUser = new User({
      username: username,
      password: hashPass,
      email: email,
      name: name
    });
    aNewUser.save((err) => {
      if (err) {
        // console.log('Saving user to database went wrong.')
        res
          .status(500)
          .json({ message: "Saving user to database went wrong." });
        return;
      }
// console.log('user created')
      // Automatically log in user after sign up
      // .login() here is actually predefined passport method
      req.login(aNewUser, (err) => {
        if (err) {
          // console.log('Login after signup went bad.')
          res.status(500).json({ message: "Login after signup went bad." });
          return;
        }
        // Send the user's information to the frontend
        // We can use also: res.status(200).json(req.user);
        res.status(200).json(aNewUser);
      });
    });
  });
});

auth.post("/login", (req, res, next) => {
  passport.authenticate("local", (err, theUser, failureDetails) => {
    if (err) {
      // console.log('Something went wrong authenticating user')
      res
        .status(500)
        .json({ message: "Something went wrong authenticating user" });
      return;
    }
    if (!theUser) {
      // console.log(failureDetails)
      // "failureDetails" contains the error messages
      // from our logic in "LocalStrategy" { message: '...' }.
      res.status(401).json(failureDetails);
      return;
    }
    // save user in session
    req.login(theUser, (err) => {
      if (err) {
        // console.log("Session save went bad.")
        res.status(500).json({ message: "Session save went bad." });
        return;
      }
      // We are now logged in (that's why we can also send req.user)
      // console.log('login')
      res.status(200).json(theUser);
    });
  })(req, res, next);
});

auth.get("/logout", (req, res, next) => {
  // req.logout() is defined by passport
  req.logout();
  res.status(200).json({ message: "Log out success!" });
});

auth.get("/loggedin", (req, res, next) => {
  // req.isAuthenticated() is defined by passport
  if (req.isAuthenticated()) {
    res.status(200).json(req.user);
    return;
  }
  res.status(403).json({ message: "Unauthorized" });
});


module.exports = auth;