// ============ Builtin imports Start ================

const validator = require("validator");
const jwt = require("jsonwebtoken");

// ============ Builtin imports end ================



// ==================== Using a predefined secret key for JWT token ==================


const secretKey = "Ubaid_secret"; // This should be stored in a secure environment



// =================== Middleware to validate email Start ====================



const emailValidator = (req, res, next) => {
  const email = req.body.email;

  if (!validator.isEmail(email)) {
    return res.status(400).send("Invalid email format");
  }

  next(); // Proceed to the next middleware/route
};


// =================== Middleware to validate email end ====================


// =================== Middleware to Auth JWT and Role Start ====================


const authJWTandRole = (role) => {
  return (req, res, next) => {
    // Retrieve the cookie header
    const cookieHeader = req.headers.cookie;

    // Extract the token from the cookie if it exists
    const token = cookieHeader
      ?.split("; ")
      .find((row) => row.startsWith("token="))
      ?.split("=")[1];

    // Check if token exists in the cookie
    if (!token) {
      return res.redirect("/login");
    }

    try {
      // Verify and decode the token
      const decoded = jwt.verify(token, secretKey);
      // Check if the role is the same as the role in the token
      if (role && role !== decoded.role) {
        return res.status(403).send("Unauthorized access");
      }
      req.user = decoded;
      next(); // Continue to the next middleware or route handler
    } catch (err) {
      return res.status(403).send("Invalid token");
    }
  };
};


// =================== Middleware to Auth JWT and Role end ====================


// =================== Middleware to Authenticate JWT Start ====================


// A same middleware that only validates the token and does not check the role
const authenticateJWT = (req, res, next) => {
  // Retrieve the cookie header
  const cookieHeader = req.headers.cookie;

  // Extract the token from the cookie if it exists
  const token = cookieHeader
    ?.split("; ")
    .find((row) => row.startsWith("token="))
    ?.split("=")[1];

  // Check if token exists in the cookie
  if (!token) {
    return res.status(403).send("Access denied. No token provided.");
  }

  try {
    // Verify and decode the token
    const decoded = jwt.verify(token, secretKey);
    // Attach user info to request object
    req.user = decoded;
    next(); // Continue to the next middleware or route handler
  } catch (err) {
    return res.status(403).send("Invalid token");
  }
};

// =================== Middleware to Authenticate JWT end ====================


// =================== Middleware module exports ====================

module.exports = {
  emailValidator,
  authJWTandRole,
  authenticateJWT,
};
