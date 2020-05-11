const mongoose = require('mongoose')
const Schema = mongoose.Schema

const citySchema = new Schema({
  name: String,
  image: {
    type: String,
    default:'https://res.cloudinary.com/deyy3glzl/image/upload/v1587652134/perfil-avalia_uekcwz.png'
  }
},
  {
    timestamps: true
  })

  
const City = mongoose.model('City', citySchema)
module.exports = City