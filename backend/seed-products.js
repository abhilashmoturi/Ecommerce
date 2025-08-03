require('dotenv').config();
const mongoose = require('mongoose');

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URL)
  .then(() => console.log('MongoDB connected for seeding'))
  .catch(err => console.error('MongoDB connection error:', err));

// Product schema (same as in index.js)
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

// Sample products for testing search functionality
const sampleProducts = [
  {
    id: 1,
    name: "Striped Flutter Sleeve Overlap Collar Peplum Hem Blouse",
    category: "women",
    image: "https://example.com/product_1.png",
    new_price: 50.0,
    old_price: 80.5,
  },
  {
    id: 2,
    name: "Men's Classic Cotton T-Shirt",
    category: "men",
    image: "https://example.com/product_2.png",
    new_price: 25.0,
    old_price: 35.0,
  },
  {
    id: 3,
    name: "Kids Colorful Dinosaur Print Dress",
    category: "kid",
    image: "https://example.com/product_3.png",
    new_price: 30.0,
    old_price: 45.0,
  },
  {
    id: 4,
    name: "Women's Elegant Evening Dress",
    category: "women",
    image: "https://example.com/product_4.png",
    new_price: 120.0,
    old_price: 150.0,
  },
  {
    id: 5,
    name: "Men's Formal Business Shirt",
    category: "men",
    image: "https://example.com/product_5.png",
    new_price: 45.0,
    old_price: 60.0,
  },
  {
    id: 6,
    name: "Kids Superhero T-Shirt",
    category: "kid",
    image: "https://example.com/product_6.png",
    new_price: 20.0,
    old_price: 28.0,
  },
  {
    id: 7,
    name: "Women's Casual Denim Jacket",
    category: "women",
    image: "https://example.com/product_7.png",
    new_price: 75.0,
    old_price: 95.0,
  },
  {
    id: 8,
    name: "Men's Sports Running Shorts",
    category: "men",
    image: "https://example.com/product_8.png",
    new_price: 35.0,
    old_price: 50.0,
  },
  {
    id: 9,
    name: "Kids Winter Warm Sweater",
    category: "kid",
    image: "https://example.com/product_9.png",
    new_price: 40.0,
    old_price: 55.0,
  },
  {
    id: 10,
    name: "Women's Summer Floral Blouse",
    category: "women",
    image: "https://example.com/product_10.png",
    new_price: 38.0,
    old_price: 52.0,
  }
];

async function seedProducts() {
  try {
    // Clear existing products
    await Product.deleteMany({});
    console.log('Cleared existing products');

    // Insert sample products
    await Product.insertMany(sampleProducts);
    console.log(`Inserted ${sampleProducts.length} sample products`);

    console.log('\nSample products added:');
    sampleProducts.forEach(product => {
      console.log(`- ${product.name} (${product.category})`);
    });

    console.log('\nYou can now test the search functionality with terms like:');
    console.log('- "shirt" (should find T-Shirt and Business Shirt)');
    console.log('- "dress" (should find Evening Dress and Dinosaur Dress)');
    console.log('- "women" (should find all women\'s products)');
    console.log('- "kids" or "kid" (should find all kids\' products)');
    console.log('- "blouse" (should find both blouses)');

  } catch (error) {
    console.error('Error seeding products:', error);
  } finally {
    mongoose.connection.close();
  }
}

seedProducts();