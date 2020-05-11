const express  = require('express');
const script    = express.Router();
const passport = require('passport')
const bcrypt   = require('bcrypt')
const City     = require('../models/City')
const uploader = require('../configs/cloudinary')

script.get("/cities", (req,res) => {
  City.findOne({
    name: req.body.name
  })
  .then(response => res.status(200).json(response))
  .catch(err => res.json(err))
})

script.get("/cities:id", (req,res) => {
  City.findOne({
    name: req.body.name
  })
  .then(response => res.status(200).json(response))
  .catch(err => res.json(err))
})

script.post("/cities", (req, res, next) => {
   // checks if body was provided
  //  if (Object.keys(req.body).length === 0) {
  //   res.status(400).json({ message: "no body provided" });
  //   return;
  // }
  City.create({
    name: req.body.name,
    image: req.body.image,
  })
    .then((response) => {
      res.json(response);
    })
    .catch((err) => {
      res.status(500).json(err);
    });
});

module.exports = script;