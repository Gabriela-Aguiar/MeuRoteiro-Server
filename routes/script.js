const express = require("express");
const script = express.Router();
const City = require("../models/City");
const Itinerate = require("../models/Itinerate");
const uploader = require("../configs/cloudinary");
const axios = require("axios");
const User = require("../models/User");
const mongoose = require("mongoose");

//Get cities api
script.get("/city", (req, res) => {
  const cityCountry = req.headers.referer.split("=")[1];
  // console.log("aqui estamos")
  axios
    .all([
      axios.get(
        `https://maps.googleapis.com/maps/api/place/textsearch/json?query=museum+rating=5+${cityCountry}&key=${process.env.GooglePlacesKey}`
      ),
      axios.get(
        `https://maps.googleapis.com/maps/api/place/textsearch/json?query=restaurants+rating=5+${cityCountry}&key=${process.env.GooglePlacesKey}`
      ),
      axios.get(
        `https://maps.googleapis.com/maps/api/place/textsearch/json?query=night_club+rating=5+${cityCountry}&key=${process.env.GooglePlacesKey}`
      ),
      axios.get(
        `https://maps.googleapis.com/maps/api/place/textsearch/json?query=tourist_attraction+${cityCountry}&key=${process.env.GooglePlacesKey}`
      ),
      axios.get(
        `https://maps.googleapis.com/maps/api/place/textsearch/json?query=aquarium+${cityCountry}&key=${process.env.GooglePlacesKey}`
      ),
      axios.get(
        `https://maps.googleapis.com/maps/api/place/textsearch/json?query=bakery+${cityCountry}&key=${process.env.GooglePlacesKey}`
      ),
      axios.get(
        `https://maps.googleapis.com/maps/api/place/textsearch/json?query=cafe+${cityCountry}&key=${process.env.GooglePlacesKey}`
      ),
      axios.get(
        `https://maps.googleapis.com/maps/api/place/textsearch/json?query=zoo+${cityCountry}&key=${process.env.GooglePlacesKey}`
      ),
      axios.get(
        `https://maps.googleapis.com/maps/api/place/textsearch/json?query=movie_theater+${cityCountry}&key=${process.env.GooglePlacesKey}`
      ),
      axios.get(
        `https://maps.googleapis.com/maps/api/place/textsearch/json?query=park+${cityCountry}&key=${process.env.GooglePlacesKey}`
      ),
      axios.get(
        `https://maps.googleapis.com/maps/api/place/textsearch/json?query=library+${cityCountry}&key=${process.env.GooglePlacesKey}`
      ),
    ])

    .then(
      axios.spread(
        (
          museumRes,
          restaurantRes,
          enterRes,
          touristRes,
          aquariumRes,
          bakeryRes,
          cafeRes,
          zooRes,
          movieTheaterRes,
          parkRes,
          libraryRes
        ) => {
          museumUnits = museumRes.data;
          restaurantUnits = restaurantRes.data;
          enterUnits = enterRes.data;
          touristUnits = touristRes.data;
          aquariumUnits = aquariumRes.data;
          bakeryUnits = bakeryRes.data;
          cafeUnits = cafeRes.data;
          zooUnits = zooRes.data;
          movie_theaterUnits = movieTheaterRes.data;
          parkUnits = parkRes.data;
          libraryUnits = libraryRes.data;
          res.json({
            museumUnits,
            restaurantUnits,
            enterUnits,
            touristUnits,
            aquariumUnits,
            bakeryUnits,
            cafeUnits,
            zooUnits,
            movie_theaterUnits,
            parkUnits,
            libraryUnits,
          });
          // use/access the results
        }
      )
    )
    .catch((error) => res.status(500).json(error));
});

//create itinerate
script.post("/city", (req, res) => {
  // console.log(
  //   req.body.scriptState.map((e) => e),
  //   "reqbody"
  // );
  let backArray = [];
  let backMap = req.body.scriptState.map((subPlace) => {
    const cityName = subPlace.plus_code.compound_code.split(",")[0];
    const cityRealName = cityName.split(" ").splice(1).join(" ");
    Itinerate.create({
      name: subPlace.name,
      rating: subPlace.rating,
      formatted_address: subPlace.formatted_address,
      city: cityRealName,
      user: req.body.user._id,
    })

      .then((response) => {
        // console.log(response);
        User.findByIdAndUpdate(
          req.body.user,
          { $push: { user: req.body.user._id } },
          { new: true }
        )
          // .populate("itinerate")
          .then((theResponse) => {
            // console.log("sucesso");
            res.json(theResponse);
          })
          .catch((err) => {
            res.status(500).json(err);
          });
      })
      .catch((err) => {
        res.status(500).json(err);
      });
  });
});

// get itinerate
script.get("/itinerate", (req, res) => {

  Itinerate.find()
    .sort({ user: -1 })
    .then((itinerate) => {
      res.json(itinerate)
      })
    .catch((error) => res.status(500).json(error));
});


// script.get("/itinerate", (req, res, next) => {
//   Itinerate.find()
//     .sort({ user: -1 })
//     .then((itinerate) => {
//       console.log(itinerate, "itinerate");
//       res.json(itinerate);
//       const getCity = itinerate.map((elem) => elem.city);
//       const query = [
//         { $match: { city: getCity } },
//         { $group: { _id: "$city" } },
//       ];
//       Itinerate.aggregate(query)
//         .then((it) => {
//           console.log(it, "it");
//           res.json(
//             it.map((el) => {
//               console.log(it, "el"), { city: el.city };
//             })
//           );
//         })
//         .catch((err) => next(err));
//     })
//     .catch((error) => res.status(500).json(error));
// });



// edit itinerate
script.put("/itinerate", (req, res) => {
  const getId = req.body.id
  const { name, city, rating, address } = req.body;
  const reqBody = { name, city, rating, formatted_address: address };

  // console.log(getId, "req body");
  Itinerate.findByIdAndUpdate(getId, reqBody)
    .then(() => {
      // console.log("atualizou"),
        res.json({
          message: `Project is updated successfully.`,
        });
    })
    .catch((err) => {
      // console.log("não atualizaou");
      res.status(500).json(err);
    });
});

// delete itinerate
script.post("/itinerate", (req, res) => {
  // console.log(req.body, 'new itinerate')
  const getId = req.body.newItinerate.map((elem) => elem._id);
  // console.log(getId);
  Itinerate.findByIdAndDelete(getId)
    .then(() => {
      res.json({
        message: `Project is removed successfully.`,
      });
    })
    .catch((err) => {
      // console.log("nao deu");
      res.status(500).json(err);
    });
});

module.exports = script;
