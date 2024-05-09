// Import necessary modules
const express = require('express');
const mongoose = require('mongoose');

// Create an Express app
const app = express();
const port = process.env.PORT || 3000;

// Middleware for parsing JSON
app.use(express.json());

// MongoDB connection
mongoose.connect('mongodb+srv://zeyadgobran:VPFr7PZ2WmsX3GE8@cluster0.8wcok61.mongodb.net/', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
  console.log('Connected to MongoDB');
});

// Define MongoDB schemas
const ProductSchema = new mongoose.Schema({
  name: String,
  price: Number,
  // Add more fields as needed
});
const Product = mongoose.model('Product', ProductSchema);

// Define routes for public API endpoints
app.get('/products', async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Define routes for private API endpoints
// Authentication middleware function
function authenticate(req, res, next) {
  // Implement your authentication logic here
  // For example, check if the user is logged in using JWT
  // If authenticated, call next(), otherwise, return a 401 Unauthorized response
  next();
}

// Example private endpoint for admin product management
app.post('/admin/products', authenticate, async (req, res) => {
  // Implement logic to add a new product
  try {
    const { name, price } = req.body;
    const product = new Product({ name, price });
    await product.save();
    res.status(201).json(product);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});// Import necessary modules
const mongoose = require('mongoose');

// Define MongoDB schema for User
const UserSchema = new mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  username: String,
  password: String,
  email: String,
  order_ids: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Order' }],
  // Add more fields as needed
});

// Create User model
const User = mongoose.model('User', UserSchema);

// Export User model
module.exports = User;
