const mongoose = require('mongoose')
const Schema = mongoose.Schema

const itinerateSchema = new Schema({
  name:String,
  category: {
    type: String,
    enum: ['restaurante', 'museu', 'entretenimento', 'ponto turístico']
  },
  rating: Number,
  address: String,
  image: {
    type: String,
    default:'https://res.cloudinary.com/deyy3glzl/image/upload/v1587652134/perfil-avalia_uekcwz.png'
  },
  // location: {
  //   type: {
  //     type: String
  //   },
  //   coordinates: [Number]
  // },
  city: {
    type: Schema.Types.ObjectId,
    ref: 'City'
  }
},
  {
    timestamps: true
  })

  
const Itinerate = mongoose.model('Itinerate', itinerateSchema)
module.exports = Itinerate