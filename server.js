const express = require('express');

const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
//const auth = require('./middleware/auth');
//const adminAuth = require('./middleware/adminAuth');
console.log('server is runing ')


app.use(express.json());

// MongoDB connection
mongoose.connect('mongodb+srv://zeyadgobran:VPFr7PZ2WmsX3GE8@cluster0.8wcok61.mongodb.net/', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

// Product schema and model
const productSchema = new mongoose.Schema({
  name: String,
  product_id: String,
  price: Number,
  
});

const Product = mongoose.model('Product', productSchema);

// User schema and model

const userSchema = new mongoose.Schema({
  customer_id: { type: String, unique: true },
  email: { type: String, unique: true },
  password: String,
  isAdmin: { type: Boolean, default: false },
  orders: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Order' }]
});

const User = mongoose.model('User', userSchema);

// Order schema and model
const orderSchema = new mongoose.Schema({
  customer_id: { type: String, required: true },
  products: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }],
  totalAmount: Number
});

const Order = mongoose.model('Order', orderSchema);

// Authentication endpoint
app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }
    const token = jwt.sign({ userId: user._id, isAdmin: user.isAdmin }, 'your_secret_key', { expiresIn: '1h' });
    res.json({ token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error' });
  }
});

// Middleware to authenticate requests
app.use(auth);

// Public endpoints
app.get('/api/products', async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error' });
  }
});

app.get('/api/products/search', async (req, res) => {
  const { query } = req.query;
  try {
    const products = await Product.find({
      $or: [
        { name: { $regex: query, $options: 'i' } },
        { category: { $regex: query, $options: 'i' } },
      ],
    });
    res.json(products);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error' });
  }
});

// Private endpoints (require authentication)
app.post('/api/orders', async (req, res) => {
  const { products, totalAmount } = req.body;
  const userId = req.user.userId;

  try {
    const order = new Order({ userId, products, totalAmount });
    await order.save();

    // Update user's orders array
    await User.findByIdAndUpdate(userId, { $push: { orders: order._id } });

    res.json(order);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error' });
  }
});

// Admin endpoints (require authentication and admin privileges)
app.use(adminAuth);

app.post('/api/products', async (req, res) => {
  // Implement product creation logic here
});

app.put('/api/products/:productId', async (req, res) => {
  // Implement product update logic here
});

app.delete('/api/products/:productId', async (req, res) => {
  // Implement product deletion logic here
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
