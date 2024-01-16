
const { MongoClient } = require('mongodb');
const mongoose = require('mongoose');
const validator = require('validator');
require('dotenv').config()

async function connexionMongoos() {
    try {
      await mongoose.connect(process.env.URL);
      console.table("Connexion OK");
      return 'Done!';
    } catch (error) {
      console.error('Error connecting to MongoDB:', error.message);
      throw error; // Rethrow the error to be caught in the route handler
    }
  }

  module.exports = {
     connexionMongoos
  }