require('dotenv').config(); // Load environment variables

const express = require('express');
const app = express();
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const path = require('path');
const cors = require('cors');

const port = process.env.PORT || 4000;

app.use(express.json());
app.use(cors());

// Connect to MongoDB using env variable
mongoose.connect(process.env.MONGODB_URL)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log('MongoDB connection error:', err));

// Root API
app.get("/", (req, res) => {
  res.send("Express running");
});

// Image storage config
const storage = multer.diskStorage({
  destination: './upload/images',
  filename: (req, file, cb) => {
    return cb(null, `${file.fieldname}_${Date.now()}${path.extname(file.originalname)}`);
  }
});
const upload = multer({ storage: storage });

app.use('/images', express.static('./upload/images'));

// Upload endpoint
app.post("/upload", upload.single('product'), (req, res) => {
  res.json({
    success: 1,
    image_url: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
  });
});

// Product schema
const Product = mongoose.model("Product", {
  id: { type: Number, required: true },
  name: { type: String, required: true },
  image: { type: String, required: true },
  category: { type: String, required: true },
  new_price: { type: Number, required: true },
  old_price: { type: Number, required: true },
  date: { type: Date, default: Date.now },
  available: { type: Boolean, default: true }
});

// Delete product
app.post('/removeproduct', async (req, res) => {
  await Product.findOneAndDelete({ id: req.body.id });
  res.json({ success: 1, name: req.body.name });
});

// Get all products
app.get('/allproducts', async (req, res) => {
  const products = await Product.find({});
  res.send(products);
});

// User schema
const Users = mongoose.model("Users", {
  name: { type: String },
  email: { type: String, unique: true },
  password: { type: String },
  cartData: { type: Object },
  date: { type: Date, default: Date.now }
});

// New collections endpoint
app.get('/newcollections', async (req, res) => {
  const products = await Product.find({});
  const newcollection = products.slice(1).slice(-8);
  res.send(newcollection);
});

// Popular in women endpoint
app.get('/popularinwomen', async (req, res) => {
  const products = await Product.find({ category: "women" });
  const popularinwomen = products.slice(0, 4);
  res.send(popularinwomen);
});

// Auth middleware
const fetchUser = async (req, res, next) => {
  const token = req.header('auth-token');
  if (!token) return res.status(401).send({ error: "Please authenticate using valid token" });

  try {
    const data = jwt.verify(token, process.env.JWT_SECRET);
    req.user = data.user;
    next();
  } catch {
    return res.status(401).send({ error: "Please authenticate using valid token" });
  }
};

// Add to cart
app.post('/addtocart', fetchUser, async (req, res) => {
  const userData = await Users.findById(req.user.id);
  userData.cartData[req.body.itemId] += 1;
  await userData.save();
  res.send("Added to cart");
});

// Remove from cart
app.post('/removefromcart', fetchUser, async (req, res) => {
  const userData = await Users.findById(req.user.id);
  if (userData.cartData[req.body.itemId] > 0) {
    userData.cartData[req.body.itemId] -= 1;
    await userData.save();
  }
  res.send("Removed from cart");
});

// Get cart
app.get('/getcart', fetchUser, async (req, res) => {
  const userData = await Users.findById(req.user.id);
  res.json(userData.cartData);
});

// Signup
app.post('/signup', async (req, res) => {
  const existing = await Users.findOne({ email: req.body.email });
  if (existing) {
    return res.status(400).json({ success: false, error: "User already exists" });
  }

  const cart = {};
  for (let i = 0; i < 300; i++) cart[i] = 0;

  const user = new Users({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    cartData: cart
  });

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

// Add new product
app.post('/addproduct', async (req, res) => {
  const products = await Product.find({});
  const lastId = products.length ? products.slice(-1)[0].id : 0;

  const product = new Product({
    id: lastId + 1,
    name: req.body.name,
    image: req.body.image,
    category: req.body.category,
    new_price: req.body.new_price,
    old_price: req.body.old_price
  });

  await product.save();
  res.json({ success: 1, name: req.body.name });
});

// Start server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
