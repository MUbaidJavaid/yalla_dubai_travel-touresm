const { collection } = require("../models/users");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const session = require("express-session");
// Using a predefined secret key for JWT token
const secretKey = "Ubaid_secret"; // This should be stored in a secure environment

// auth user post
function postauth(req, res) {
  const user = req.user;
  res.status(200).json({ user });
}

// login get
function getlogin(req, res) {
  res.render("login");
}
//signup get
function getsignup(req, res) {
  res.render("signup");
}
// admin get
function getadmin(req, res) {
  res.render("admin");
}

// post signup
async function postsignup(req, res) {
  try {
    // Create user data from request body
    const data = {
      name: req.body.username,
      email: req.body.email,
      password: req.body.password,
      role: "user",
    };

    // exist user
    const existuser = await collection.findOne({ email: data.email });

    if (existuser != null) {
      return res.status(409).send("User already exists"); // 409 means conflict
    } else {
      // hash the password
      const hashpasword = await bcrypt.hash(data.password, 10);
      data.password = hashpasword;
      const userdata = await collection.insertMany(data);
      res.redirect("/login");
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "An error occurred while signing up the user",
      error: error.message,
    });
  }
}

async function postget(req, res) {
  try {
    // Find user by email
    const user = await collection.findOne({ email: req.body.email });

    // Check if user exists
    if (!user) {
      return res.status(404).send("User not found"); // User not found
    }

    // Check if the password matches
    const passwordMatch = await bcrypt.compare(
      req.body.password,
      user.password
    );

    if (passwordMatch) {
      // Check the user's role
      const role = user.role; // Assuming `role` is stored in the user's document in MongoDB

      // If password matched, generate JWT token and send that token to user otherwise a suitable response
      const token = jwt.sign({ email: user.email, role: user.role }, secretKey);

      // Return token in the cookie with security
      res.cookie("token", token, {
        httpOnly: true,
        secure: true,
        sameSite: "Strict",
      });
      // sameSite: 'Strict' can be used too

      req.session.userId = user.id; // Store user ID in session for cart management
      req.session.cart = []; // Initialize cart in the session

      // Redirect to page according to role

      if (role === "user") {
        return res.redirect("/home"); // Render home page for normal users
      } else if (role === "admin") {
        return res.redirect("/admin"); // Render admin page for admin users
      } else {
        return res.status(403).send("Unauthorized access"); // If role is something unexpected
      }
    } else {
      return res.status(401).send("Wrong password"); // Wrong password
    }
  } catch (error) {
    console.error("Error during login:", error); // Log the error for debugging
    return res.status(500).send("An error occurred while logging in"); // General error message
  }
}

module.exports = {
  postauth,
  getlogin,
  getsignup,
  getadmin,
  postsignup,
  postget,
};
