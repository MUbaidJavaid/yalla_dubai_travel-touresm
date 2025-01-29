
const express = require("express");
const cors = require('cors');
const app = express();
exports.app = app;
// convert data into json 
app.use(cors());
const router = express.Router();

// routes
// const { getuserordersdetails, getadmin, postproductcreat, getsingleproduct, deleteproduct, postproductupdate, getadminproductadd, getadminproductupdate 
//  }  = require("../controllers/admindashbord.js");
const adminfunctions = require("../controllers/admindashbord.js");
const { authJWTandRole, corsOptions } = require("../middlewares/middlewares");
const multipleUpload  = require("../middlewares/upload.js");  

// console.log(adminfunctions);
// console.log(multipleUpload);


// ============= Get Routes Start ================


// admin get route
// app.get("/admin", authJWTandRole("admin"), getadmin);
router.get("/api/admin", cors(corsOptions) , authJWTandRole("admin"), adminfunctions.getadmin);

// app.get("/userordersdetails", authJWTandRole("admin"),function getuserordersdetails (){})
router.get("/api/userordersdetails", cors(corsOptions),  authJWTandRole("admin"), adminfunctions.getuserordersdetails );


router.get("/api/productdetail", cors(corsOptions), authJWTandRole("admin"), adminfunctions.getadminproductadd) ;

// get product detail update render route
router.get("/api/productupdate", cors(corsOptions), authJWTandRole("admin"), adminfunctions.getadminproductupdate );

// get single product route
router.get("/api/singleproduct", cors(corsOptions), authJWTandRole("admin"), adminfunctions.getsingleproduct);


// ============= Get Routes end ================


// =============== Post Routes Start ===============

// logout post route

router.post("/api/logout", (req, res) => {
  res.clearCookie("token"); // Remove JWT token
  req.session.destroy(); // Clear the session
  res.redirect("/api/login");//-
});//-
// adminRoutes.js//+
//+
router.post('/api/productdetail', authJWTandRole("admin"), multipleUpload, adminfunctions.postproductcreat);//+
//+
router.post('/api/productupdate', authJWTandRole("admin"), multipleUpload, adminfunctions.postproductupdate);//+
//+
router.get('/api/deleteproduct', cors(corsOptions), adminfunctions.deleteproduct);//+

//+
module.exports = router;//+


