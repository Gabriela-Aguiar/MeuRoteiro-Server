const mongoose = require('mongoose')
const Schema = mongoose.Schema

const itinerateSchema = new Schema({
  name: String,
  types: [],
  rating: Number,
  formatted_address: String,
  photos: {
    type: String,
    default:'https://res.cloudinary.com/deyy3glzl/image/upload/v1587652134/perfil-avalia_uekcwz.png'
  },
  // location: {
  //   type: {
  //     type: String
  //   },
  //   coordinates: [Number]
  // },
  city: String,
  user: {
    type: Schema.Types.ObjectId,
    ref: "User"
  },
  notes: String
},
  {
    timestamps: true
  })

  
const Itinerate = mongoose.model('Itinerate', itinerateSchema)
module.exports = Itinerate