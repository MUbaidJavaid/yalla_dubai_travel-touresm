// ============ Builtin imports Start ================


const express = require("express");
const path = require("path");
const cors = require('cors');
const session = require("express-session");
const cookieParser = require("cookie-parser");
const bodyParser = require('body-parser');
const mongoDbSession = require('connect-mongodb-session')(session);
const { execFile } = require('child_process');
const multer = require("multer");
const fs = require('fs').promises;
// Load environment variables from .env file
require('dotenv').config({ path: './src/.env' });

// ============ Builtin imports end ================


// ============ User define imports Start ================

const connectMongoDB  = require("./config");
const { getlogin, getsignup } = require("../controllers/users");
const { gethome, getproduct, getCity, removefromcart } = require("../controllers/productes");
const { postpersonal, getpersonal } = require("../controllers/personal");
const { postauth, postsignup, postget } = require("../controllers/users");
const { authJWTandRole, emailValidator, authenticateJWT, loginLimiter } = require("../middlewares/middlewares");

const { getuserordersdetails, getadmin, postproductcreat, getsingleproduct, deleteproduct }  = require("../controllers/admindashbord");
const  Productes  = require("../models/productes");
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

connectMongoDB(`mongodb://${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`)
  .then(() => console.log("Mongo connected!"))
  .catch((err) => console.log("Err: ", err));

  const store = new mongoDbSession({
    uri: `mongodb://${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`,
    collection: "sessions"
});

// ============== mongoDB connection end =================


// ============= Code Injection Security Start =================


app.get('/exec', (req, res) => {
  const allowedCommands = {
      list: 'ls',
      currentDir: 'pwd',
  };

  const commandKey = req.query.command;

  // Allow only predefined safe commands
  if (!allowedCommands[commandKey]) {
      return res.status(400).send('Invalid command');
  }

  execFile(allowedCommands[commandKey], (error, stdout, stderr) => {
      if (error) {
          res.status(500).send(`Error: ${stderr}`);
      } else {
          res.send(`Output: ${stdout}`);
      }
  });
});

// ============= Code Injection Security end =================


// =============== Middleware Start ====================


// convert data into json
app.use(cors());

app.use(express.json());

app.use(cookieParser());

// app.set('views', path.join(__dirname, 'src','views'));  // This should point to the correct directory
// use EJS view engine
app.set("view engine", "ejs");

// static file
app.use(express.static("uploads"));

// Middleware to parse JSON body
app.use(bodyParser.json());

app.use(express.urlencoded({ extended: false }));

app.use(express.static(path.join(__dirname, "uploads")));

app.use((req, res, next) => {
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
  res.setHeader('Pragma', 'no-cache');
  res.setHeader('Expires', '0');
  res.setHeader('Surrogate-Control', 'no-store');
  next();
});


// Session middleware for handling session storage
// Initialize session middleware
app.use(session( {
      secret: process.env.SESSIONS_SECRT_KEY || 'fallback_secret',
      name: "my-custom-product-session-id",
      resave: false,
      saveUninitialized: true,
      cookie: {
        maxAge: 24 * 60 * 60 * 1000,
        httpOnly: true,
        secure: false,
      },
      store: store,
}));

// app.use((req, res, next) => {
//   console.log("Session data:", req.session);
//   next();
// });

const corsOptions = {
  "origin": process.env.CORS_OPTIONS,
  "methods": "GET,HEAD,PUT,PATCH,POST,DELETE",
  "preflightContinue": false,
  "optionsSuccessStatus": 204
};


const users = [];


// ============= Middleware end ==================


// ============= Middleware Start =============
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    return cb(null, './uploads');
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
     return cb(null, `${file.fieldname}_${uniqueSuffix}_${file.originalname}`);
  }
})

const upload = multer({ storage });

// Adjust multer to handle multiple file fields
const multipleUpload = upload.fields([
  { name: 'cityImage', maxCount: 1 },  // Single city image
  { name: 'thumbnail', maxCount: 3 }   // Single thumbnail image
]);





// ============= Get Routes Start ================



// login get route
app.get("/login", getlogin);

// signup get route
app.get("/signup", getsignup);

//  home get route
app.get("/api/home", gethome);

// admin get route
// app.get("/admin", authJWTandRole("admin"), getadmin);
app.get("/api/admin", getadmin);

// app.get("/userordersdetails", authJWTandRole("admin"),function getuserordersdetails (){})
app.get("/api/userordersdetails", getuserordersdetails );

// get cart route 
app.get('/api/cart', authJWTandRole("user"), getpersonal);

// add to remove cart route
app.get('/remove-from-cart',authJWTandRole("user") , removefromcart );

// get product route
app.get("/api/product",cors(corsOptions),authJWTandRole("user"), getproduct);

// get city route
app.get("/api/city", cors(corsOptions), authJWTandRole("user"), getCity);

app.get("/api/productdetail", authJWTandRole("admin"), (req, res) => { 
  res.render('productdetail', { title: 'Product Detail' });
});

// get product detail update render route

app.get("/api/productupdate", cors(corsOptions), authJWTandRole("admin"), (req, res) => {
  res.render('editproduct', { title: 'Product Update' });

});
// get single product route

app.get("/api/singleproduct", cors(corsOptions), authJWTandRole("admin"), getsingleproduct);


// ============= Get Routes end ================


// =============== Post Routes Start ===============



// post authUser route
app.post("/auth", authenticateJWT, postauth);

// Signup post route
app.post("/api/signup", emailValidator, postsignup);

// login post route
app.post("/api/login", loginLimiter, postget);

// post cart route
app.post('/api/cart', authJWTandRole("user"), postpersonal );

// post product detail route
app.post('/api/productdetail', authJWTandRole("admin"), multipleUpload, postproductcreat);

app.post('/api/productupdate', authJWTandRole("admin") , multipleUpload, async function postproductupdate(req, res) {

  try {
    // const productId = req.query.id;
    const productId =  "67939b115228175dd268b87b";
    if (!productId) {
      return res.status(400).json({ message: "Invalid product id" });
    }
    const { 
      cityName, citydescription, tourService, duration, transportService, pickUp, producttitle, discountPercentage, discountedtotal, price, prime, nonprime, privatetransferprice,   quantity,  productdescription,  privatetransferperson,  categorie,  adultBaseprice,  kidsBaseprice,  translatelanguage, wifi, } = req.body;

      let cityImage = "";
      let thumbnail = [];

      // Check if files are uploaded
      if (req.file) {
        // Single file upload for cityImage
        cityImage = req.file.filename;
      } else {
        // If no new cityImage uploaded, use the old one from req.body
        cityImage = req.body.cityImage || ""; // Fallback to the old image
      }

      // Check for multiple files (for thumbnails)
      if (req.files && req.files.thumbnail) {
        thumbnail = req.files.thumbnail.map(file => file.filename);
      }

      // Function to delete old files
      const deleteOldFiles = async () => {
        try {
          // Check and delete the old city image if available
          if (req.body.cityImage && req.body.cityImage1 !== cityImage) {
            // Only delete if the city image is actually different or exists
            await fs.unlink(`./uploads${req.body.cityImage1}`);
            console.log(`Deleted old city image: ${req.body.cityImage1}`);
          }
      console.log(`Deleted old city image: ${req.body}`);
          // Check and delete old thumbnails if available
          if (req.body.thumbnail0) {
            await fs.unlink(`./uploads${req.body.thumbnail0}`);
            console.log(`Deleted old thumbnail0: ${req.body.thumbnail0}`);
          }
          if (req.body.thumbnail1) {
            await fs.unlink(`./uploads${req.body.thumbnail1}`);
            console.log(`Deleted old thumbnail1: ${req.body.thumbnail1}`);
          }
          if (req.body.thumbnail2) {
            await fs.unlink(`./uploads${req.body.thumbnail2}`);
            console.log(`Deleted old thumbnail2: ${req.body.thumbnail2}`);
          }

          console.log('Old files deleted successfully!');
        } catch (error) {
          console.error(`Error deleting old files: ${error.message}`);
        }
      };

      // Delete old files before saving new ones
      await deleteOldFiles();

      // If no new city image is uploaded, use the old city image
      if (!req.file && req.body.cityImage) {
        cityImage = req.body.cityImage;
      }

      // If no new thumbnails are uploaded, use the old thumbnails
      if (!req.files || !req.files.thumbnail) {
        thumbnail = req.body.thumbnail || [];
      }

            

    const product = await Productes.findByIdAndUpdate(productId, {   
      cityName,
      citydescription,
      cityImage, 
      tourService, 
      duration, 
      transportService, 
      pickUp, 
      producttitle, 
      discountPercentage, 
      discountedtotal, 
      thumbnail, 
      price, 
      prime, 
      nonprime, 
      privatetransferprice, 
      quantity, 
      productdescription, 
      privatetransferperson,
      categorie,
      adultBaseprice,
      kidsBaseprice,
      translatelanguage,
      wifi, }, { new: true });
    res.status(200).json({ message: "Product updated successfully", product });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});


app.get('/api/deleteproduct',deleteproduct);


// logout post route
app.post("/api/logout", (req, res) => {
  res.clearCookie("token"); // Remove JWT token
  req.session.destroy(); // Clear the session
  res.redirect("/login");
});


// =============== Post Routes end ===============


// ============= Server Create ==================

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server started on port number: ${port}`);
});
