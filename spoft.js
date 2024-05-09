import express from 'express';

const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const authMiddleware = require('../middleware/authMiddleware');
const adminMiddleware = require('../middleware/adminMiddleware');
const Product = require('../models/Product');
const User = require('../models/User');
const Order = require('../models/Order');

// Public endpoints for product catalog
router.get('/products', async (req, res) => {
    try {
        // Fetch products from the database
        const products = await Product.find();
        res.json(products);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// Private endpoint for order management
router.get('/orders', authMiddleware, async (req, res) => {
    try {
        // Fetch orders for the current user from the database
        const orders = await Order.find({ user: req.user.id });
        res.json(orders);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// Admin-only endpoint for adding a new product
router.post('/products/add', authMiddleware, adminMiddleware, async (req, res) => {
    try {
        // Add new product to the database
        const newProduct = new Product(req.body);
        await newProduct.save();
        res.json(newProduct);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// Admin-only endpoint for updating a product
router.put('/products/:id/update', authMiddleware, adminMiddleware, async (req, res) => {
    try {
        // Update product details in the database
        const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!product) {
            return res.status(404).json({ msg: 'Product not found' });
        }
        res.json(product);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// Admin-only endpoint for deleting a product
router.delete('/products/:id/delete', authMiddleware, adminMiddleware, async (req, res) => {
    try {
        // Delete product from the database
        const product = await Product.findByIdAndDelete(req.params.id);
        if (!product) {
            return res.status(404).json({ msg: 'Product not found' });
        }
        res.json({ msg: 'Product deleted' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
