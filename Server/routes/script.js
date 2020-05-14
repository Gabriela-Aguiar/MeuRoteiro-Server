const express  = require('express');
const script    = express.Router();
const passport = require('passport')
const City     = require('../models/City')
const Itinerate     = require('../models/Itinerate')
const uploader = require('../configs/cloudinary')
const axios = require("axios")

//get cities
script.get("/cities", (req,res) => {
  City.find()
  .then(response => res.status(200).json(response))
  .catch(err => res.json(err))
})


//create cities
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


//get cities details
script.get("/cities/:id", (req,res) => {
  City.findById(req.params.id)
  .then(response => res.status(200).json(response))
  .catch(err => res.json(err))
})



//create itinerate
script.post("/itinerate", (req,res) => {
  Itinerate.create({ 
    name: req.body.name,
    category: req.body.category,
    rating: req.body.rating,
    address: req.body.address,
    image: req.body.image,
    city: req.body.cityID
    })
      .then((response) => {
        City.findByIdAndUpdate(
          req.body.cityID,
          {
            $push: { itinerate: response._id },
          },
          { new: true }
        )
          .populate("itinerate")
          .then((theResponse) => {
            res.json(theResponse);
          })
          .catch((err) => {
            console.log('erro')
            res.status(500).json(err);
          });
      })
      .catch((err) => {
        console.log('erro2')
        res.status(500).json(err);
      });
});


//Get itinerate
script.get("/cities/:id/itinerate/:itinerateId", (req, res, next) => {
  Itinerate.findById(req.params.itinerateId)
    .populate("city")
    .then((theCity) => {
      res.json(theCity);
    })
    .catch((err) => {
      res.status(500).json(err);
    });
});



// script.get( '/city', ( req, res ) => {
 
//   let restaurants = `https://maps.googleapis.com/maps/api/place/textsearch/json?query=restaurants+toronto+canada&key=${process.env.GooglePlacesKey}`
  
//   axios.get(restaurants)
//       .then( resp => {
//           console.log(resp.data)
//           res.json(resp.data)
//           } )
         
     
//       .catch( error => res.status(500).json(error) ) 

// } )

script.get( '/city', ( req, res ) => {
  
 
  axios.all([
    axios.get(`https://maps.googleapis.com/maps/api/place/textsearch/json?query=museum+sao_paulo+brasil&key=${process.env.GooglePlacesKey}`),
    axios.get(`https://maps.googleapis.com/maps/api/place/textsearch/json?query=restaurants+sao_paulo+brasil&key=${process.env.GooglePlacesKey}`),
    axios.get(`https://maps.googleapis.com/maps/api/place/textsearch/json?query=night_club+sao_paulo+brasil&key=${process.env.GooglePlacesKey}`),
    axios.get(`https://maps.googleapis.com/maps/api/place/textsearch/json?query=tourist_attraction+sao_paulo+brasil&key=${process.env.GooglePlacesKey}`)
   ])
      .then( axios.spread((museumRes, restaurantRes, enterRes, touristRes) => {
        
        museumUnits = museumRes.data
        restaurantUnits = restaurantRes.data
        enterUnits = enterRes.data
        touristUnits = touristRes.data
        res.json({museumUnits, restaurantUnits, enterUnits, touristUnits})
        console.log(museumUnits)
        // use/access the results
      }))
      .catch( error => res.status(500).json(error) )
} )




module.exports = script;