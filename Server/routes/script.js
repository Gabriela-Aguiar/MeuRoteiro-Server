const express  = require('express');
const script    = express.Router();
const City     = require('../models/City')
const Itinerate     = require('../models/Itinerate')
const uploader = require('../configs/cloudinary')
const axios = require("axios")
const User = require ('../models/User')
const mongoose = require ('mongoose')


//Get cities api
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


//create itinerate
script.post("/city", (req, res) => {

  // console.log(req.body.scriptState.map(e => e), 'reqbody')
  let backArray = []
  let backMap = req.body.scriptState.map(subPlace => {
    
  const cityName = subPlace.plus_code.compound_code.split(',')[0]
  const cityRealName = cityName.split(' ').splice(1).join(' ')
  Itinerate
    .create({
      name: subPlace.name,
      rating: subPlace.rating,
      formatted_address: subPlace.formatted_address,
      city: cityRealName,
      user: req.body.user._id
    })

    .then(response => {
      console.log(response)
      User.findByIdAndUpdate(req.body.user, {$push: { user: req.body.user._id },}, { new: true })
        // .populate("itinerate")
        .then((theResponse) => {
          console.log('sucesso')
          res.json(theResponse);
        })
        .catch((err) => {
          res.status(500).json(err);
        });
    })
    .catch((err) => {
      res.status(500).json(err);
    });
    })


  })
  

    

    // get itinerate
    script.get("/itinerate", (req, res) => {
      Itinerate.find()
        .sort({ user: -1 })
        .then((projects) => res.json(projects))
        .catch((error) => res.status(500).json(error));
    });


    //edit itinerate
    script.put("/profile/:id", (req, res, next) => {
      // if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      //   res.status(400).json({ message: "Specified id is not valid" });
      //   return;
      // } 
      Itinerate.findByIdAndUpdate(req.params.id, { $set: req.body })
        .then(() => {
          res.json({
            message: `Task with ${req.params.id} is updated successfully.`,
          });
        })
        .catch((err) => {
          res.json(err);
        });
    });



    // script.post("/itinerate", (req, res) => {
    //   // const getId = req.body.newItinerate.map(elem => elem._id)
    //   // if (!mongoose.Types.ObjectId.isValid(getId)) {
    //   //   res.status(400).json({ message: "Specified id is not valid" });
    //   //   console.log(req.body.scriptState._id, 'entrou na rota mas nao no id')
    //   //   return;
    //   // }
    //   // console.log(req.body.scriptState._id, "olha o req")
    //   // console.log(req.body, 'sucesso')
    //   // console.log(getId, 'getid')
    
    //   Itinerate.findByIdAndDelete(req.body.newItinerate._id)
    //     .then(() => {
    //       res.json({
    //         message: `Project is removed successfully.`,
    //       });
    //     })
    //     .catch((err) => {
    //       console.log('nao deu')
    //       res.status(500).json(err);
    //     });
    // });
    

module.exports = script;