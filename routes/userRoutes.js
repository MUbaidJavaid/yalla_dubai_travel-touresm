
const express = require("express");

const app = express();

const router = express.Router();

// routes





const { getlogin, getsignup } = require("../controllers/users");
const { postauth, postsignup, postget } = require("../controllers/users");
const { authJWTandRole, emailValidator, authenticateJWT, loginLimiter } = require("../middlewares/middlewares");
const { postpersonal, getpersonal } = require("../controllers/personal");

// signup get route
router.get("/signup", getsignup);

// login get route
router.get("/login", getlogin);

// get cart route 
router.get('/api/cart', authJWTandRole("user") , getpersonal);



// post authUser route
router.post("/auth", authenticateJWT, postauth);

// Signup post route
router.post("/signup", emailValidator, postsignup);

// login post route
router.post("/login", loginLimiter, postget);

// post cart route
router.post('/api/cart', authJWTandRole("user"), postpersonal );

module.exports = router;