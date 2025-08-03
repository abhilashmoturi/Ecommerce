# Quick Start Guide - Search Functionality

## Prerequisites
- Node.js installed
- MongoDB running
- Environment variables configured (.env file in backend folder)

## Setup & Testing

### 1. Start the Application

#### Backend (Terminal 1):
```bash
cd backend
npm install
npm start
```
The backend will start on `http://localhost:4000`

#### Frontend (Terminal 2):
```bash
cd frontend
npm install
npm start
```
The frontend will start on `http://localhost:3000`

### 2. Seed Sample Products (Optional)
If your database is empty, run this script to add sample products:
```bash
cd backend
node seed-products.js
```

### 3. Test the Search Functionality

#### Using the Web Interface:
1. Open `http://localhost:3000` in your browser
2. Look for the search bar in the navigation (between menu and login)
3. Try these test searches:
   - **"shirt"** - Should find T-Shirt and Business Shirt
   - **"dress"** - Should find Evening Dress and Dinosaur Dress  
   - **"women"** - Should show all women's products
   - **"kids"** - Should show all kids' products
   - **"blouse"** - Should find blouse products
4. Use the category dropdown to filter results
5. Test on mobile by resizing your browser window

#### Using API Directly:
```bash
# Basic search
curl "http://localhost:4000/search?query=shirt"

# Category-filtered search
curl "http://localhost:4000/search?query=dress&category=women"

# Search by category name
curl "http://localhost:4000/search?query=men"
```

### 4. Key Features to Test

#### Search Bar:
- ✅ Type search terms and press Enter
- ✅ Click the search button  
- ✅ Select different categories from dropdown
- ✅ Responsive design on mobile devices

#### Search Results Page:
- ✅ Loading spinner appears during search
- ✅ Product cards display correctly
- ✅ Hover effects on product cards
- ✅ Price display (new/old prices)
- ✅ Category tags on products
- ✅ "No results" state with category suggestions
- ✅ Error handling for network issues

#### Navigation:
- ✅ URL updates with search parameters
- ✅ Browser back button works
- ✅ Bookmark/share search URLs
- ✅ Navigation between search and other pages

### 5. Mobile Testing
Resize your browser or use developer tools to test:
- **Desktop (1280px+)**: Full search bar with category dropdown
- **Tablet (768-1279px)**: Compressed layout
- **Mobile (<768px)**: Search bar moves below navigation, full width
- **Small Mobile (<480px)**: Category dropdown hidden

### 6. Common Test Scenarios

#### Successful Searches:
- Product names: "shirt", "dress", "blouse", "jacket"
- Categories: "men", "women", "kids"
- Partial matches: "shirt" finds "T-Shirt" and "Business Shirt"

#### Edge Cases:
- Empty search (should show validation)
- No results found (should show helpful message)
- Special characters in search
- Very long search terms
- Network errors (disconnect internet temporarily)

### 7. Development Mode Features

#### Hot Reload:
- Make changes to search components
- Browser automatically updates
- Test new features immediately

#### Console Logs:
- Check browser console for any errors
- Backend console shows search queries
- Network tab shows API calls

### 8. File Locations for Customization

#### Backend Search Logic:
- `backend/index.js` - Line ~154 (search endpoint)

#### Frontend Components:
- `frontend/src/components/SearchBar/SearchBar.jsx` - Search input component
- `frontend/src/pages/SearchResults.jsx` - Results display page
- `frontend/src/components/navbar/Navbar.jsx` - Navigation integration

#### Styling:
- `frontend/src/components/SearchBar/SearchBar.css` - Search bar styles
- `frontend/src/pages/CSS/SearchResults.css` - Results page styles
- `frontend/src/components/navbar/navbar.css` - Updated navbar styles

### 9. Troubleshooting

#### Search Not Working:
1. Check backend is running on port 4000
2. Check MongoDB connection
3. Check browser console for errors
4. Verify CORS is enabled in backend

#### No Results Showing:
1. Check if products exist in database
2. Run seed script: `node backend/seed-products.js`
3. Check search API endpoint directly

#### Styling Issues:
1. Clear browser cache
2. Check CSS files are loading
3. Verify responsive breakpoints

#### Mobile Layout Problems:
1. Test with browser developer tools
2. Check viewport meta tag in HTML
3. Verify CSS media queries

### 10. Next Steps

#### For Development:
- Add more sophisticated search features
- Implement search suggestions/autocomplete
- Add search analytics
- Optimize for SEO

#### For Production:
- Set up proper environment variables
- Configure production MongoDB
- Optimize images and assets
- Add search result caching

## Support
If you encounter any issues:
1. Check the detailed documentation in `SEARCH_FUNCTIONALITY.md`
2. Review the console logs for error messages
3. Test the API endpoints directly with curl
4. Verify all dependencies are installed correctly