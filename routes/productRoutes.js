
const express = require("express");
const cors = require('cors');
const app = express();

// convert data into json
app.use(cors());
const router = express.Router();

// routes



const { gethome, getproduct, getCity, removefromcart } = require("../controllers/productes");
const { authJWTandRole, corsOptions } = require("../middlewares/middlewares");

//  home get route
router.get("/api/home", gethome);


// get product route
router.get("/api/product",cors(corsOptions),authJWTandRole("user"), getproduct);

// get city route
router.get("/api/city", cors(corsOptions), authJWTandRole("user"), getCity);

// add to remove cart route
router.get('/remove-from-cart',authJWTandRole("user") , removefromcart );

module.exports = router;