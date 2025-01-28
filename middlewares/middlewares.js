// ============ Builtin imports Start ================
const validator = require("validator");
const jwt = require("jsonwebtoken");
const rateLimit = require('express-rate-limit');
const { execFile } = require('child_process');
require('events').EventEmitter.defaultMaxListeners = 15; // Increase global listener limit if needed
// ============ Builtin imports end ================


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


process.once('exit', () => {
  console.log('Final cleanup before exit');
});
console.log('Script is running');


  const allowedCommands =  (req, res) => {
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
};


// =================== Middleware to validate email Start ====================



const corsOptions = {
  "origin": process.env.CORS_OPTIONS,
  "methods": "GET,HEAD,PUT,PATCH,POST,DELETE",
  "preflightContinue": false,
  "optionsSuccessStatus": 204
};


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
      const decoded = jwt.verify(token, process.env.TOKEN_SECRET_KEY);
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
    const decoded = jwt.verify(token, process.env.TOKEN_SECRET_KEY);
    // Attach user info to request object
    req.user = decoded;
    next(); // Continue to the next middleware or route handler
  } catch (err) {
    return res.status(403).send("Invalid token");
  }
};

// =================== Middleware to Authenticate JWT end ====================




// ================== Middleware Limit repeated login attempts Start =================

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // 5 attempts
  message: 'Too many login attempts, please try again later.',
});

// ================== Middleware Limit repeated login attempts end =================


// ================== Middleware to handle file uploads Start =================
// Middleware to set headers for caching
const headers = (req, res, next) => {
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
  res.setHeader('Pragma', 'no-cache');
  res.setHeader('Expires', '0');
  res.setHeader('Surrogate-Control', 'no-store');
  next();
}

// =================== Middleware module exports ====================

module.exports = {
  emailValidator,
  authJWTandRole,
  authenticateJWT,
  loginLimiter,
  corsOptions,
  headers,
  allowedCommands,
};
