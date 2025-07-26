require('dotenv').config(); // Load env variables

const express = require('express');
const app = express();
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const path = require('path');
const cors = require('cors');

const port = process.env.PORT || 4000;

// Middleware
app.use(express.json());
app.use(cors());

// MongoDB connection
mongoose.connect(process.env.MONGODB_URL)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

// Root route
app.get("/", (req, res) => {
  res.send("Express running");
});

// Serve static image folder
app.use('/images', express.static(path.join(__dirname, 'upload/images')));

// Multer image upload config
const storage = multer.diskStorage({
  destination: path.join(__dirname, '../upload/images'),
  filename: (req, file, cb) => {
    cb(null, `${file.fieldname}_${Date.now()}${path.extname(file.originalname)}`);
  }
});
const upload = multer({ storage });

// Upload endpoint
app.post("/upload", upload.single('product'), (req, res) => {
  const imageUrl = `${req.protocol}://${req.get('host')}/images/${req.file.filename}`;
  res.json({ success: 1, image_url: imageUrl });
});

// Schema
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

// Middleware for auth
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

// API Endpoints
app.get('/allproducts', async (req, res) => {
  const products = await Product.find({});
  res.send(products);
});

app.get('/newcollections', async (req, res) => {
  const products = await Product.find({});
  const newcollection = products.slice(1).slice(-8);
  res.send(newcollection);
});

app.get('/popularinwomen', async (req, res) => {
  const products = await Product.find({ category: "women" });
  res.send(products.slice(0, 4));
});

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

app.post('/login', async (req, res) => {
  const user = await Users.findOne({ email: req.body.email });
  if (!user || req.body.password !== user.password) {
    return res.json({ success: false, error: "Invalid credentials" });
  }

  const token = jwt.sign({ user: { id: user.id } }, process.env.JWT_SECRET);
  res.json({ success: true, token });
});

app.post('/addproduct', async (req, res) => {
  const products = await Product.find({});
  const lastId = products.length ? products.slice(-1)[0].id : 0;

  const product = new Product({ id: lastId + 1, ...req.body });
  await product.save();
  res.json({ success: 1, name: req.body.name });
});

app.post('/removeproduct', async (req, res) => {
  await Product.findOneAndDelete({ id: req.body.id });
  res.json({ success: 1, name: req.body.name });
});

app.post('/addtocart', fetchUser, async (req, res) => {
  const user = await Users.findById(req.user.id);
  user.cartData[req.body.itemId] += 1;
  await user.save();
  res.send("Added to cart");
});

app.post('/removefromcart', fetchUser, async (req, res) => {
  const user = await Users.findById(req.user.id);
  if (user.cartData[req.body.itemId] > 0) {
    user.cartData[req.body.itemId] -= 1;
    await user.save();
  }
  res.send("Removed from cart");
});

app.get('/getcart', fetchUser, async (req, res) => {
  const user = await Users.findById(req.user.id);
  res.json(user.cartData);
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
