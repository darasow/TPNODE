const mongoose = require("mongoose")
const Documents = mongoose.model('Documents', {
    name: {
      type: String,
      required: true,
    },
    url: {
      type: String,
      required: true,
    },
    
  });

  module.exports = {
    Documents
  }