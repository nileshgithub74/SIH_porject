const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');


// Initialize app
const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Serve static files (Frontend HTML and JS)
app.use(express.static('./'));
app.use(cors({
    origin: 'http://localhost:3000',  // Adjust this to the actual origin of your frontend
    credentials: true
}));

// MongoDB connections
const buyerDbConnection = mongoose.createConnection('mongodb://localhost:27017/buyer-db', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

const sellerDbConnection = mongoose.createConnection('mongodb://localhost:27017/seller-db', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

// Load models for each connection
const BuyerUser = buyerDbConnection.model('User', new mongoose.Schema({
    fullName: String,
    phoneNumber: String,
    email: String,
    password: String,
    age: Number, 
    addresses: [
        {
            street: String,
            city: String,
            state: String,
            zipCode: String,
            country: String
        }
    ],
    currentOrders: [
        {
            transactionId: String,
            sellerEmail: String,
            date: Date,
            items: [
                {
                    itemId: Number,
                    itemQuantity: Number,
                    itemPrice: Number
                }   
            ],
            status: String,
            addresses: [
                {
                    street: String,
                    city: String,
                    state: String,
                    zipCode: String,
                    country: String
                }
            ],
            totalPrice: Number
        }
    ],
    
    orderHistory:[
        {
            transactionId: String,
            sellerEmail: String,
            date: Date,
            items: [
                {
                    itemId: Number,
                    itemQuantity: Number,
                    itemPrice: Number
                }
            ],
            status: String,
            addresses: [
                {
                    street: String,
                    city: String,
                    state: String,
                    zipCode: String,
                    country: String
                }
            ],
            totalPrice: Number
        }
    ],
    cart: [
        {
            date: Date,
            items: [
                {
                    itemId: Number,
                    itemQuantity: Number,
                    itemPrice: Number,
                    itemDescription: String,
                    itemImg: String
                }
            ],
            totalPrice: Number
        }
    ],

}));

const SellerUser = sellerDbConnection.model('User', new mongoose.Schema({
    fullName: String,
    phoneNumber: String,
    email: String,
    password: String,
    age: Number,
    addresses: [
        {
            street: String,
            city: String,
            state: String,
            zipCode: String,
            country: String
        }
    ],
    availableItems: [
        {
            itemId: Number,
            itemQuantity: Number,
            itemPrice: Number,
            itemDescription: String,
            itemImg: String
        }
    ],
    currentOrders: [
        {
            transactionId: String,
            buyerEmail: String,
            date: Date,
            items: [
                {
                    itemId: Number,
                    itemQuantity: Number,
                    itemPrice: Number
                }
            ],
            status: String,
            addresses: [
                {
                    street: String,
                    city: String,
                    state: String,
                    zipCode: String,
                    country: String
                }
            ],
            totalPrice: Number
        }
    ],
    
    orderHistory:[
        {
            transactionId: String,
            buyerEmail: String,
            date: Date,
            ordereditems: [
                {
                    itemId: Number,
                    itemQuantity: Number,
                    itemPrice: Number
                }
            ],
            status: String,
            addresses: [
                {
                    street: String,
                    city: String,
                    state: String,
                    zipCode: String,
                    country: String
                }
            ],
            totalPrice: Number
        }
    ],
    
}));

// Session Middleware (for both databases)
app.use(session({
    secret: 'supersecretkey',
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({ mongoUrl: 'mongodb://localhost:27017/buyer-db' }),  // Buyer DB used for session storage
    cookie: { maxAge: 1000 * 60 * 60 * 24 } // 1 day session
}));


//index 

app.get('/', (req, res) => {
    // Check if user session exists
    // const isLoggedIn = req.session.userName && req.session.userPassword;

    // Serve the HTML page
    res.sendFile(path.join(__dirname, 'index.html'));

});









// Buyer Routes

// Buyer Registration Route
app.post('/buyer-register', async (req, res) => {
    const { fullName, phoneNumber, email, password } = req.body;

    try {
        const userExists = await BuyerUser.findOne({ email });
        if (userExists) {
            return res.status(400).json({ message: "Email already exists." });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new BuyerUser({ fullName, phoneNumber, email, password: hashedPassword });

        await newUser.save();
        res.status(201).json({ message: "Buyer registered successfully" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Buyer Login Route
app.post('/buyer-login', async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await BuyerUser.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: "User not found" });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Incorrect password" });
        }

        req.session.userId = user._id;
        req.session.email = user.email;

        res.status(200).json({ message: "Login successful" });
    } catch (err) {
        res.status(500).json({ message: "Server error" });
    }
});

// Seller Routes

// Seller Registration Route
app.post('/seller-register', async (req, res) => {
    const { fullName, phoneNumber, email, password } = req.body;

    try {
        const userExists = await SellerUser.findOne({ email });
        if (userExists) {
            return res.status(400).json({ message: "Email already exists." });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new SellerUser({ fullName, phoneNumber, email, password: hashedPassword });

        await newUser.save();
        res.status(201).json({ message: "Seller registered successfully" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Seller Login Route
app.post('/seller-login', async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await SellerUser.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: "User not found" });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Incorrect password" });
        }

        req.session.userId = user._id;
        req.session.email = user.email;

        res.status(200).json({ message: "Login successful" });
    } catch (err) {
        res.status(500).json({ message: "Server error" });
    }
});

// Protected Route
app.get('/dashboard', (req, res) => {
    if (!req.session.userId) return res.status(401).json({ message: "Unauthorized" });

    res.sendFile(__dirname + '/public/dashboard.html'); // Serve dashboard HTML
});





app.post('/profile', async (req, res) => {
    try {
        const { email, userType } = req.body;  // Extract email and userType from the request body
        let user;

        if (userType === 'buyer') {
            user = await BuyerUser.findOne({ email });  // Find the buyer in the database
        } else if (userType === 'seller') {
            user = await SellerUser.findOne({ email });  // Find the seller in the database
        } else {
            return res.status(400).json({ message: 'Invalid user type' });
        }

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Respond with the user data
        res.status(200).json({
            fullName: user.fullName,
            email: user.email,
            phoneNumber: user.phoneNumber
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});


app.post('/seller-post', async (req, res) => {
    const { email, quantity, price, description,itemId, itemImg } = req.body;

    try {
        // Find the seller by email
        const seller = await SellerUser.findOne({ email: email });
        
        if (!seller) {
            return res.status(404).json({ message: 'Seller not found' });
        }

        // Add new item to the availableItems array
        const newItem = {
            itemId: itemId,
            itemQuantity: quantity,
            itemPrice: price,
            itemDescription: description,
            itemImg: itemImg // Assuming the image is also sent in the request
        };

        seller.availableItems.push(newItem);

        // Save the updated seller document
        await seller.save();

        res.status(200).json({ message: 'Item added successfully', seller });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});



app.post('/buyer-get', async (req, res) => {
    const { itemId } = req.body;

    try {
        // Find all sellers who have the specified itemId in their availableItems
        const sellers = await SellerUser.find({ "availableItems.itemId": itemId });

        if (!sellers || sellers.length === 0) {
            return res.status(404).json({ message: 'Item not found with the given itemId' });
        }

        // Find all matching items across all sellers
        let matchingItems = [];

        sellers.forEach(seller => {
            const foundItems = seller.availableItems.filter(item => item.itemId === itemId);
            if (foundItems.length > 0) {
                foundItems.forEach(item => {
                    matchingItems.push({
                        sellerEmail: seller.email,     // Include seller's email
                        sellerName: seller.fullName,   // Include seller's name
                        item: item,                    // Add the item details
                    });
                });
            }
        });

        if (matchingItems.length === 0) {
            return res.status(404).json({ message: 'Item not found' });
        }

        // Send all matching items and their corresponding seller details as a response
        res.status(200).json(matchingItems);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});



app.post('/seller-get-products', async (req, res) => {
    const { email } = req.body;
    try {
      const seller = await SellerUser.findOne({ email: email });
      if (!seller) {
        return res.status(404).json({ message: 'Seller not found' });
      }
      res.status(200).json(seller.availableItems);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  });
  
  app.post('/seller-remove-product', async (req, res) => {
    const { email, itemId } = req.body;
    try {
      const seller = await SellerUser.findOne({ email: email });
      if (!seller) {
        return res.status(404).json({ message: 'Seller not found' });
      }
  
      // Remove the product with the given itemId
      seller.availableItems = seller.availableItems.filter(item => item.itemId !== itemId);
      await seller.save();
  
      res.status(200).json({ message: 'Product removed successfully' });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  });
  

app.post('/seller-remove-product', async (req, res) => {
    const { email, itemId } = req.body;
  
    try {
      const seller = await SellerUser.findOne({ email });
  
      if (!seller) {
        return res.status(404).json({ message: 'Seller not found' });
      }
  
      // Filter out the item with the given itemId
      const updatedItems = seller.availableItems.filter(item => item._id.toString() !== itemId);
  
      if (updatedItems.length === seller.availableItems.length) {
        return res.status(404).json({ message: 'Item not found' });
      }
  
      seller.availableItems = updatedItems;
      await seller.save(); // Save the updated seller document
  
      res.status(200).json({ message: 'Product removed successfully' });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  });
  
  app.post('/buyer-add-to-cart', async (req, res) => {
    const { email, itemId, itemPrice, itemQuantity, sellerEmail } = req.body;

    try {
        // Find the buyer by email
        const buyer = await BuyerUser.findOne({ email: email });
        if (!buyer) {
            return res.status(404).json({ message: 'Buyer not found' });
        }

        // Create the new cart item
        const newItem = {
            itemId: itemId,
            itemQuantity: itemQuantity,
            itemPrice: itemPrice
        };

        // Check if the cart already has this item
        const existingItem = buyer.cart.find(cartItem => cartItem.itemId === itemId);
        if (existingItem) {
            // If item already exists in the cart, update the quantity
            existingItem.itemQuantity += Number(itemQuantity);
        } else {
            // If item does not exist, add it to the cart
            buyer.cart.push({
                date: new Date(),
                items: [newItem],
                totalPrice: Number(itemPrice) * Number(itemQuantity)
            });
        }

        // Save the updated buyer details
        await buyer.save();
        res.status(200).json({ message: 'Item added to cart' });

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

// Assuming you have an express app instance
app.post('/buyer-get-cart', async (req, res) => {
    const { email } = req.body;

    try {
        // Find the user by email
        const user = await BuyerUser.findOne({ email: email });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Get cart items
        const cartItems = user.cart;

        if (cartItems.length === 0) {
            return res.status(404).json({ message: 'No items in the cart' });
        }

        // Send the cart items as response
        res.status(200).json(cartItems);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});







// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
