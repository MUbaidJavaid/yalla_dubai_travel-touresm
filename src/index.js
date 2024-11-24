const express = require("express");
const path = require("path");
const session = require("express-session");
const cookieParser = require("cookie-parser");
const bodyParser = require('body-parser');
const mongoDbSession = require('connect-mongodb-session')(session);
const { connectMongoDB } = require("./config");
require("../middlewares/middlewares");
require("../models/users");
require("../models/productes");
const Productes  = require("../models/productes");
const { getlogin, getsignup, getadmin } = require("../controllers/users");
const { gethome, postaddtocart } = require("../controllers/productes");
const { authJWTandRole } = require("../middlewares/middlewares");
const { postauth, postsignup, postget } = require("../controllers/users");
const {
  emailValidator,
  authenticateJWT,
} = require("../middlewares/middlewares");
const cors = require('cors');
const app = express();
require('events').EventEmitter.defaultMaxListeners = 15; // Increase global listener limit if needed


let listenerAdded = false;

function addListener() {
  if (!listenerAdded) {
    process.once('exit', () => {
      console.log('Process is exiting');
    });
    listenerAdded = true; // Prevent duplicate listeners
  }
}

// Ensure this is only called once in your script
addListener();

// Another listener can still be added if needed
process.once('exit', () => {
  console.log('Final cleanup before exit');
});

console.log('Script is running');
// connecction
connectMongoDB("mongodb://127.0.0.1:27017/login")
  .then(() => console.log("Mongo connected!"))
  .catch((err) => console.log("Err: ", err));

  const store = new mongoDbSession({
    uri: 'mongodb://127.0.0.1:27017/login',
    collection: "mySession"
});

// convert data into json
app.use(cors());
app.use(express.json());
app.use(cookieParser());
// Middleware to parse JSON body
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));


app.use((req, res, next) => {
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
  res.setHeader('Pragma', 'no-cache');
  res.setHeader('Expires', '0');
  res.setHeader('Surrogate-Control', 'no-store');
  next();
});

// Session middleware for handling session storage
app.use(
  session({
    secret: "session_secret_key",
    resave: false,
    saveUninitialized: true,
    cookie: {
      maxAge: 24 * 60 * 60 * 1000, // 1 day in milliseconds
      secure: false               // true if using HTTPS; set false for HTTP
    }, // Set `true` if using HTTPS
    store: store,
  })
);

const corsOptions = {
  "origin": "*",
  "methods": "GET,HEAD,PUT,PATCH,POST,DELETE",
  "preflightContinue": false,
  "optionsSuccessStatus": 204
}

const users = [];

// use EJS view engine
app.set("view engine", "ejs");
// static file
app.use(express.static("public"));

// login get route
app.get("/login", getlogin);

// signup get route
app.get("/signup", getsignup);

// admin get route
app.get("/admin", authJWTandRole("admin"), getadmin);

//  home get route
app.get("/home", authJWTandRole("user"), gethome);

// Route to handle data from the frontend
// app.post('/submit', (req, res) => {
//   const { first_name, last_name, address } = req.body;
//   console.log('Received Data:', { first_name, last_name, address });

  // Send response back to the client
//   res.json({
//       message: 'Data received successfully!',
//       receivedData: { first_name, last_name, address },
//   });
// });

app.post('/cart', authJWTandRole("user"), (req, res) => {
    const data = req.body;
    const productId = req.query.id;
  // Perform server-side validation
    const errors = [];
    if (!data.first_name) errors.push("First name is required.");
    if (!data.last_name) errors.push("Last name is required.");
    if (!/^\d{16}$/.test(data.card_number)) errors.push("Card number must be 16 digits.");
    if (!/^\d{2}\/\d{2}$/.test(data.expiry)) errors.push("Expiry must be in MM/YY format.");
    if (!/^\d{3}$/.test(data.cvv)) errors.push("CVV must be 3 digits.");

    if (errors.length > 0) {
        return res.status(400).json({ success: false, errors });
    }
    console.log(productId);

    // Log data to console (or process/save it as needed)
    console.log('Received Data:', data);
  if (!req.session.cart) {
      req.session.cart = []; // Initialize cart if it doesn't exist
  }

    //   const newCartItem = {
    //     title,
    //     adults_no,
    //     kids_no,
    //     totalCost,
    //     first_name,
    //     last_name,
    //     address,
    //     payment,
    //     city,
    //     state,
    //     country,
    //     zip,
    // };

    // req.session.cart.push(newCartItem); // Add product to the session cart
    res.json({ message: 'Product added to cart', cart: req.session.cart });
});

// get cart route 
app.get('/cart', authJWTandRole("user"), async(req, res) => {
  const productId = req.query.id;
  const adults_no = req.query.adults_no;
  const kids_no = req.query.kids_no;
  const check_in = req.query.check_in;
  const check_out = req.query.check_out;
  const days_count = req.query.days_count;
  const total_no = req.query.total_no;
  const totalCost = req.query.totalCost;
  try{  
     // Fetch the product details from the database
     const products = await Productes.findById(productId);  
    if (!products) {
      return res.status(404).json({ error: "Product not found" });
    }

    // Return product data as JSON
   const producte = ({
      id: products.id,
      title: products.title,
      price: products.price,
      adultBaseprice: products.adultBaseprice,
      kidsBaseprice: products.kidsBaseprice,
      dayBaseprice: products.dayBaseprice,
      thumbnail: products.thumbnail,
    });
    // console.log(product);
       // Return JSON response
      //  res.json(producte);
      const product = ({
        productId : req.query.id,
        adults_no : req.query.adults_no,
        kids_no : req.query.kids_no,
        check_in : req.query.check_in,
        check_out : req.query.check_out,
        days_count : req.query.days_count,
        totalCost : req.query.totalCost,
     }); 
     const cartItem = {
      productId,
      adults_no,
      kids_no,
      check_in,
      check_out,
      days_count,
      totalCost,
      total_no,
      ...producte,
      };
      
      if (!req.session.cart) {
          req.session.cart = [];
      }
      
      const itemIndex = req.session.cart.findIndex(item => item.productId === productId);
      
      if (itemIndex === -1) {
          // Item does not exist, add it
          req.session.cart.push(cartItem);
      } else {
          // Update the existing item (if needed)
          req.session.cart[itemIndex] = cartItem;
      }
      // Render the cart with all session items
      res.render('cart', { cart: req.session.cart });
    //  res.render('cart',{ product,producte });
  } catch (error) {

    console.error("Error fetching product data:", error);
    res.status(500).json({ error: "Internal server error" });
  }
  // const product = await Productes.findById(productId);


    // console.log(productId);
    // console.log( adults_no);
    // console.log(kids_no);
    // console.log(check_in);
    // console.log(check_out);
    // console.log(days_count);
    // console.log(total_no);
    // console.log(totalCost);

});

app.get('/remove-from-cart', (req, res) => {
  const productId = req.query.productId;

  if (req.session.cart) {
      req.session.cart = req.session.cart.filter(item => item.productId !== productId);
      if (req.session.cart.length === 0) {
        // Clear the session or redirect to /product
          delete req.session.cart;
          return res.redirect('/product');
      }
  }

  // Render the updated cart immediately
  res.render('cart', { cart: req.session.cart });
});

app.get("/product",cors(corsOptions),authJWTandRole("user"), async(req, res) => {
  const productId = req.query.id; // Directly get the `id` from query parameters
  try{  
     // Fetch the product details from the database
     const product = await Productes.findById(productId);  
    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }
    // Return product data as JSON
   const producte = ({
      id: product.id,
      title: product.title,
      price: product.price,
      adultBaseprice: product.adultBaseprice,
      kidsBaseprice: product.kidsBaseprice,
      dayBaseprice: product.dayBaseprice,
      thumbnail: product.thumbnail,
    });
    // console.log(product);
       // Return JSON response
      //  res.json(producte);
     res.render("product", { product: product }); // Pass product data to the template

  } catch (error) {
    console.error("Error fetching product data:", error);
    res.status(500).json({ error: "Internal server error" });
  }
  // const product = await Productes.findById(productId);


});
// Protected route to view the user's cart
app.get("/addtocart", authJWTandRole("user"), async (req, res) => {
  // const products = await Productes.find({});
  const productId = req.query.id;
  const product = await Productes.findById(productId);
  // Pass products to the template to render them in the view
  res.render("addtocart", { product: product });
  // res.render("addtocart");
  // res.json({ cart: req.session.cart });
});
// post authUser route
app.post("/auth", authenticateJWT, postauth);

// Signup post route
app.post("/signup", emailValidator, postsignup);

// login post route
app.post("/login", postget);

// postaddtocard
// app.post("/addtocart", authJWTandRole("user"), postaddtocart);

// app.post("/" ,(req,res) =>{
// console.log("hello");

// })
// logout post route
app.post("/logout", (req, res) => {
  res.clearCookie("token"); // Remove JWT token
  req.session.destroy(); // Clear the session
  res.redirect("/login");
});

const port = 5000;
app.listen(port, () => {
  console.log(`Server started on port number: ${port}`);
});
