
const express = require("express");
const cors = require('cors');
const app = express();
exports.app = app;
// convert data into json 
app.use(cors());
const router = express.Router();

// routes
const { getuserordersdetails, getadmin, postproductcreat, getsingleproduct, deleteproduct, postproductupdate, getadminproductadd, getadminproductupdate 
 }  = require("../controllers/admindashbord.js");
const { authJWTandRole, corsOptions } = require("../middlewares/middlewares");
const createMultipleUploadMiddleware = require("../src/index.js");  

// console.log(multipleUpload);


// ============= Get Routes Start ================


// admin get route
// app.get("/admin", authJWTandRole("admin"), getadmin);
router.get("/api/admin", cors(corsOptions) , authJWTandRole("admin"), getadmin);

// app.get("/userordersdetails", authJWTandRole("admin"),function getuserordersdetails (){})
router.get("/api/userordersdetails", cors(corsOptions),  authJWTandRole("admin"), getuserordersdetails );


router.get("/api/productdetail", cors(corsOptions), authJWTandRole("admin"), getadminproductadd) ;

// get product detail update render route
router.get("/api/productupdate", cors(corsOptions), authJWTandRole("admin"), getadminproductupdate );

// get single product route
router.get("/api/singleproduct", cors(corsOptions), authJWTandRole("admin"), getsingleproduct);


// ============= Get Routes end ================


// =============== Post Routes Start ===============




// adminRoutes.js

router.post('/api/productdetail', authJWTandRole("admin"), createMultipleUploadMiddleware, postproductcreat);

router.post('/api/productupdate', authJWTandRole("admin"), createMultipleUploadMiddleware, postproductupdate);


router.get('/api/deleteproduct', cors(corsOptions), deleteproduct);


// logout post route

router.post("/api/logout", (req, res) => {
  res.clearCookie("token"); // Remove JWT token
  req.session.destroy(); // Clear the session
  res.redirect("/api/login");//-
});//-
// adminRoutes.js//+
//+
router.post('/api/productdetail', authJWTandRole("admin"), multipleUpload, postproductcreat);//+
//+
router.post('/api/productupdate', authJWTandRole("admin"), multipleUpload, postproductupdate);//+
//+
router.get('/api/deleteproduct', cors(corsOptions), deleteproduct);//+

//+
module.exports = router;//+


