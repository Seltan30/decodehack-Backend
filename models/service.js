const mongoose = require('mongoose');
const { Schema } = mongoose;

const serviceSchema = new Schema({
  name:        { type: String, required: true },        // par exemple bus saiid 
  type:        { type: String, required: true, enum: ['bus','train','tramway'] },
  price:   { type: Number, required: true }, 
  comfort:     { type: Number, required: true },         
  frequency:   { type: Number, default: 15 },           // temps entre chaque bus (ex: chaque 30min bus)
  turnaround:  { type: Number, default: 10 }           // temps fl terminus
});

const Service = mongoose.model('Service', serviceSchema);
module.exports = Service;