const mongoose = require('mongoose')
const Schema = mongoose.Schema

const userSchema = new Schema({
  username:{
    type: String,
    required: true
  },
  password: String,
  email: String,
  name: String,
  image: {
    type: String,
    default:'https://res.cloudinary.com/deyy3glzl/image/upload/v1587652134/perfil-avalia_uekcwz.png'
  }
},
  {
    timestamps: true
  })

  
const User = mongoose.model('User', userSchema)
module.exports = User