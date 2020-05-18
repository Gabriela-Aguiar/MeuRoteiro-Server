const express  = require('express');
const script    = express.Router();
const passport = require('passport')
const City     = require('../models/City')
const Itinerate     = require('../models/Itinerate')
const uploader = require('../configs/cloudinary')
const axios = require("axios")

//get cities
// script.get("/cities", (req,res) => {
//   axios.get(restaurants)
//   .then( resp => {
//       console.log(resp.data)
//       res.json(resp.data)
//       } )
//   .catch( error => res.status(500).json(error) ) 
//   })
// })


// get cities details
// script.get("/cities/:id", (req,res) => {
//   City.findById(req.params.id)
//   .then(response => res.status(200).json(response))
//   .catch(err => res.json(err))
// })

// script.get("/cities/:id", (req,res) => {
//   const city = req.body.value

//   let places = `https://maps.googleapis.com/maps/api/place/textsearch/json?query=+${city}&key=${process.env.GooglePlacesKey}`

//   axios.get(places)
//   .then( resp => {
//       res.json(resp.data)
//       })
//   .catch( error => res.status(500).json(error) ) 
//   })



//create itinerate
script.get("/profile/:id", (req,res) => {

  // Itinerate.create({ 
  //   name: req.body.name,
  //   category: req.body.category,
  //   rating: req.body.rating,
  //   address: req.body.address,
  //   image: req.body.image,
  //   city: req.body.cityID
  //   })
      // .then((response) => {
        
      //   res.json(response.data)
      // })
      // .catch((err) => {
      //   console.log('erro2')
      //   res.status(500).json(err);
      // });
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


script.get( '/city', ( req, res ) => {
  const cityCountry = req.headers.referer.split('=')[1]
  
   axios.all([
    axios.get(`https://maps.googleapis.com/maps/api/place/textsearch/json?query=museum+rating=5+${cityCountry}&key=${process.env.GooglePlacesKey}`),
    axios.get(`https://maps.googleapis.com/maps/api/place/textsearch/json?query=restaurants+rating=5+${cityCountry}&key=${process.env.GooglePlacesKey}`),
    axios.get(`https://maps.googleapis.com/maps/api/place/textsearch/json?query=night_club+rating=5+${cityCountry}&key=${process.env.GooglePlacesKey}`),
    axios.get(`https://maps.googleapis.com/maps/api/place/textsearch/json?query=tourist_attraction+${cityCountry}&key=${process.env.GooglePlacesKey}`),
    axios.get(`https://maps.googleapis.com/maps/api/place/textsearch/json?query=aquarium+${cityCountry}&key=${process.env.GooglePlacesKey}`),
    axios.get(`https://maps.googleapis.com/maps/api/place/textsearch/json?query=bakery+${cityCountry}&key=${process.env.GooglePlacesKey}`),
    axios.get(`https://maps.googleapis.com/maps/api/place/textsearch/json?query=cafe+${cityCountry}&key=${process.env.GooglePlacesKey}`),
    axios.get(`https://maps.googleapis.com/maps/api/place/textsearch/json?query=zoo+${cityCountry}&key=${process.env.GooglePlacesKey}`),
    axios.get(`https://maps.googleapis.com/maps/api/place/textsearch/json?query=movie_theater+${cityCountry}&key=${process.env.GooglePlacesKey}`),
    axios.get(`https://maps.googleapis.com/maps/api/place/textsearch/json?query=park+${cityCountry}&key=${process.env.GooglePlacesKey}`),
    axios.get(`https://maps.googleapis.com/maps/api/place/textsearch/json?query=library+${cityCountry}&key=${process.env.GooglePlacesKey}`),
   ])
    
      .then( axios.spread((museumRes, restaurantRes, enterRes, touristRes, aquariumRes, bakeryRes, cafeRes, zooRes, movieTheaterRes, parkRes, libraryRes) => {
        
        museumUnits = museumRes.data
        restaurantUnits = restaurantRes.data
        enterUnits = enterRes.data
        touristUnits = touristRes.data
        aquariumUnits = aquariumRes.data
        bakeryUnits = bakeryRes.data
        cafeUnits = cafeRes.data
        zooUnits = zooRes.data
        movie_theaterUnits = movieTheaterRes.data
        parkUnits = parkRes.data
        libraryUnits = libraryRes.data
        res.json({museumUnits, restaurantUnits, enterUnits, touristUnits, aquariumUnits, bakeryUnits, cafeUnits, zooUnits, movie_theaterUnits, parkUnits, libraryUnits})
        // use/access the results
       
      }))
      .catch( error => res.status(500).json(error) )
} )

script.post("/city", (req, res) => {
  let backArray = []
  let backMap = req.body.scriptState.map(place => place.map(subPlace => backArray.push(subPlace)))
  console.log(req, "olha o req")

  
  Itinerate
    .create({
      name: backArray[0].name,
      rating: backArray[0].rating,
      formatted_address: backArray[0].formatted_address,
      photos: backArray[0].photos,
    })
    .then(response => {
      user.findByIdAndUpdate(req.body.user)
    })

} )


module.exports = script;