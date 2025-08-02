const mongoose = require('mongoose');
const { Schema } = mongoose;

const routeSchemaSchema = new Schema({
    price: { type: Number, required: true },
    comfort: { type: Number, required: true },
    avgtime: { type: Number, required: true },
    
},
{ timestamps: true });

const Route = mongoose.model('route', routeSchema);
module.exports = Route;