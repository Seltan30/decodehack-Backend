const mongoose = require('mongoose');
const { Schema } = mongoose;

const userSchema = new Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    premium: { type: Boolean, default: false },
    skipsRemaining: { type: Number, default: 3 },
    skippedUsers: { type: [String], default: [] },
},
{ timestamps: true });

const User = mongoose.model('User', userSchema);
module.exports = User;