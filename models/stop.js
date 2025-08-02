const mongoose = require('mongoose');
const { Schema } = mongoose;

// Une palce par exemple bab elzouar
const stopSchema = new Schema({
  name:    { type: String, required: true, unique: true },
  coords:  {                 
    lat:    Number,
    lng:    Number
  }
});

const Stop = mongoose.model('Stop', stopSchema);
module.exports = Stop;