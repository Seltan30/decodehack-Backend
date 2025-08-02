const mongoose = require('mongoose');
const { Schema } = mongoose;

const transportSchemaSchema = new Schema({
    name: { type: String, required: true },
    price: { type: Number, required: true },
    comfort: { type: Number, required: true },

},
{ timestamps: true });

const Transport = mongoose.model('Transport', transportSchema);
module.exports = Transport;