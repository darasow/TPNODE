const mongoose = require("mongoose")
const validator = require("validator")

const User = mongoose.model('User', {
    name: {
      type: String,
      required: true,
    },
    age: {
      type: Number,
      required: true,
      validate: {
        validator: (v) => v >= 0,
        message: "L'age doit être positif",
      },
    },
    email: {
      type: String,
      required: true,
      validate: {
        validator: (v) => validator.isEmail(v),
        message: "L'email n'est pas valide",
      },
    },
    password: {
      type: String,
      required: true,
      validate: {
        validator: (v) => validator.isLength(v, { min: 5, max: 20 }),
        message: "Le mot de passe est invalide",
      },
    },
  });


  module.exports = {
    User
  }