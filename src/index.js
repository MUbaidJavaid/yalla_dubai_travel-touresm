// ============ Builtin imports Start ================


const express = require("express");
const path = require("path");
const cors = require('cors');
const session = require("express-session");
const cookieParser = require("cookie-parser");
const bodyParser = require('body-parser');
const mongoDbSession = require('connect-mongodb-session')(session);

// ============ Builtin imports end ================


// ============ User define imports Start ================

const { connectMongoDB } = require("./config");
const { getlogin, getsignup, getadmin } = require("../controllers/users");
const { gethome, getproduct, getCity, removefromcart } = require("../controllers/productes");
const { postpersonal, getpersonal } = require("../controllers/personal");
const { authJWTandRole } = require("../middlewares/middlewares");
const { postauth, postsignup, postget } = require("../controllers/users");
const {
  emailValidator,
  authenticateJWT,
} = require("../middlewares/middlewares");


// ============ User define imports end  ================


const app = express();
require('events').EventEmitter.defaultMaxListeners = 15; // Increase global listener limit if needed



// =========== Functions Start =============



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

// =========== Functions end =============


// ============== mongoDB connection Start =================


// connecction
connectMongoDB("mongodb://127.0.0.1:27017/yalla_clone")
  .then(() => console.log("Mongo connected!"))
  .catch((err) => console.log("Err: ", err));
  const store = new mongoDbSession({
    uri: 'mongodb://127.0.0.1:27017/yalla_clone',
    collection: "sessions"
});

// ============== mongoDB connection end =================


// =============== Middleware Start ====================


// convert data into json
app.use(cors());

app.use(express.json());

app.use(cookieParser());

// use EJS view engine
app.set("view engine", "ejs");

// static file
app.use(express.static("public"));

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


// ============= Middleware end ==================


// ============= Get Routes Start ================



// login get route
app.get("/login", getlogin);

// signup get route
app.get("/signup", getsignup);

//  home get route
app.get("/home", gethome);

// admin get route
app.get("/admin", authJWTandRole("admin"), getadmin);

// get cart route 
app.get('/cart', authJWTandRole("user"), getpersonal);

app.get('/remove-from-cart',authJWTandRole("user") , removefromcart );


app.get("/product",cors(corsOptions),authJWTandRole("user"), getproduct);

app.get("/city", cors(corsOptions), authJWTandRole("user"), getCity);




// ============= Get Routes end ================


// =============== Post Routes Start ===============



// post authUser route
app.post("/auth", authenticateJWT, postauth);

// Signup post route
app.post("/signup", emailValidator, postsignup);

// login post route
app.post("/login", postget);

// post cart route
app.post('/cart', authJWTandRole("user"), postpersonal );

// logout post route
app.post("/logout", (req, res) => {
  res.clearCookie("token"); // Remove JWT token
  req.session.destroy(); // Clear the session
  res.redirect("/login");
});


// =============== Post Routes end ===============


// ============= Server Create ==================

const port = 5000;
app.listen(port, () => {
  console.log(`Server started on port number: ${port}`);
});
