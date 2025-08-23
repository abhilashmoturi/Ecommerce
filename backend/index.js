require('dotenv').config(); // Load env variables

const express = require('express');
const app = express();
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const cors = require('cors');
const { v2: cloudinary } = require('cloudinary');
const { CloudinaryStorage } = require('multer-storage-cloudinary');

const port = process.env.PORT || 4000;

// Middleware
app.use(express.json());
app.use(cors());

// MongoDB connection
mongoose.connect(process.env.MONGODB_URL)
  .then(() => console.log('✅ MongoDB connected'))
  .catch(err => console.error('❌ MongoDB connection error:', err));

// Root route
app.get("/", (req, res) => {
  res.send("Express running with Cloudinary");
});

// ================== CLOUDINARY CONFIG ==================
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// Multer storage with Cloudinary
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'ecommerce_products', // Folder name in Cloudinary
    allowed_formats: ['jpg', 'png', 'jpeg', 'webp']
  },
});
const upload = multer({ storage });

// ✅ Upload endpoint (Cloudinary)
app.post("/upload", upload.single('product'), (req, res) => {
  res.json({
    success: 1,
    image_url: req.file.path // Cloudinary hosted URL
  });
});

// ================== SCHEMAS ==================
const Product = mongoose.model("Product", {
  id: Number,
  name: String,
  image: String,
  category: String,
  new_price: Number,
  old_price: Number,
  date: { type: Date, default: Date.now },
  available: { type: Boolean, default: true }
});

const Users = mongoose.model("Users", {
  name: String,
  email: { type: String, unique: true },
  password: String,
  cartData: Object,
  date: { type: Date, default: Date.now }
});

// ================== AUTH MIDDLEWARE ==================
const fetchUser = async (req, res, next) => {
  const token = req.header('auth-token');
  if (!token) return res.status(401).send({ error: "Please authenticate using valid token" });

  try {
    const data = jwt.verify(token, process.env.JWT_SECRET);
    req.user = data.user;
    next();
  } catch {
    return res.status(401).send({ error: "Invalid token" });
  }
};

// ================== API ENDPOINTS ==================

// Get all products
app.get('/allproducts', async (req, res) => {
  const products = await Product.find({});
  res.send(products);
});

// New collections (last 8 excluding first one)
app.get('/newcollections', async (req, res) => {
  const products = await Product.find({});
  const newcollection = products.slice(1).slice(-8);
  res.send(newcollection);
});

// Popular in women (first 4)
app.get('/popularinwomen', async (req, res) => {
  const products = await Product.find({ category: "women" });
  res.send(products.slice(0, 4));
});

// Signup
app.post('/signup', async (req, res) => {
  const existing = await Users.findOne({ email: req.body.email });
  if (existing) return res.status(400).json({ success: false, error: "User already exists" });

  const cart = {};
  for (let i = 0; i < 300; i++) cart[i] = 0;

  const user = new Users({ ...req.body, cartData: cart });
  await user.save();

  const token = jwt.sign({ user: { id: user.id } }, process.env.JWT_SECRET);
  res.json({ success: true, token });
});

// Login
app.post('/login', async (req, res) => {
  const user = await Users.findOne({ email: req.body.email });
  if (!user || req.body.password !== user.password) {
    return res.json({ success: false, error: "Invalid credentials" });
  }

  const token = jwt.sign({ user: { id: user.id } }, process.env.JWT_SECRET);
  res.json({ success: true, token });
});

// Add product
app.post('/addproduct', async (req, res) => {
  const products = await Product.find({});
  const lastId = products.length ? products.slice(-1)[0].id : 0;

  const product = new Product({ id: lastId + 1, ...req.body });
  await product.save();
  res.json({ success: 1, name: req.body.name });
});

// Remove product
app.post('/removeproduct', async (req, res) => {
  await Product.findOneAndDelete({ id: req.body.id });
  res.json({ success: 1, name: req.body.name });
});

// Add to cart
app.post('/addtocart', fetchUser, async (req, res) => {
  const user = await Users.findById(req.user.id);
  user.cartData[req.body.itemId] += 1;
  await user.save();
  res.send("Added to cart");
});

// Remove from cart
app.post('/removefromcart', fetchUser, async (req, res) => {
  const user = await Users.findById(req.user.id);
  if (user.cartData[req.body.itemId] > 0) {
    user.cartData[req.body.itemId] -= 1;
    await user.save();
  }
  res.send("Removed from cart");
});

// Get cart
app.get('/getcart', fetchUser, async (req, res) => {
  const user = await Users.findById(req.user.id);
  res.json(user.cartData);
});

// ================== START SERVER ==================
app.listen(port, () => {
  console.log(`✅ Server running at ${process.env.BACKEND_URL} on port ${port}`);
});
