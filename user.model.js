// Import necessary modules
const mongoose = require('mongoose');

// Define MongoDB schema for User
const UserSchema = new mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  username: String,
  password: String,
  email: String,
  order_ids: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Order' }],
  Isadmin :Boolean,
  // Add more fields as needed
});

// Create User model
const User = mongoose.model('User', UserSchema);

// Export User model
module.exports = User;
