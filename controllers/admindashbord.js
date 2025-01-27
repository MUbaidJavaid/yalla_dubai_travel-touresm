
const Payment = require("../models/payment");
 const collection = require("../models/users");
const  Productes = require("../models/productes");

// ============= admin get function Start ================

async function getadmin(req, res) {
   // if (!req.user || req.user.role!== "admin") {
   //   return res.redirect("/login");
   // }
 
   // Fetch all users data
   const users = await collection.find({ role: { $ne: 'admin' } });
 
   // Fetch all products data
   const products = await Productes.find();
 
 
   // Render admin page with fetched personal data
   const order = await Payment.find();
 
   // res.render("admin");
   res.json({ users, order, products });
   }
 
 // ============= admin get function end ================

async function getuserordersdetails(req,res){
    try {
   
         const userId = req.query.userId;
         // console.log("userId: " + userId);
         const userDetails = await Payment.find({userId: userId});
   
         // console.log(userDetails);
         res.json(userDetails);
   
    } catch (error) {
   
       console.log(error);
       res.status(500).send("Server Error");
    }
   
   };

   async function  postproductcreat(req, res){
      try {
        const { cityName, citydescription, tourService, duration, transportService, pickUp, producttitle, discountPercentage, discountedtotal,  price, prime, nonprime, privatetransferprice, quantity, productdescription, privatetransferperson, categorie, adultBaseprice, kidsBaseprice, translatelanguage, wifi } = req.body;
        const cityImage = req.files['cityImage'] ? req.files['cityImage'][0].filename : null;
        const thumbnail = req.files['thumbnail'] ? req.files['thumbnail'].map(file => file.filename) : [];
    
        if (!cityName ||!citydescription ||!cityImage ||!tourService ||!duration ||!transportService ||!pickUp ||!producttitle ||!discountPercentage ||!discountedtotal ||!thumbnail ||!price ||!prime ||!nonprime ||!privatetransferprice ||!quantity ||!productdescription ||!privatetransferperson ||!categorie ||!adultBaseprice ||!kidsBaseprice ||!translatelanguage ||!wifi) {
          return res.status(400).json({ msg: "All fields are required" });
        }
    
    
        const product = await Productes.create({
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
          wifi,
        });
        res.json(product);
      } catch (error) {
        console.error(error);
        res.status(500).send("Server Error");
      }
    }



    async function getsingleproduct(req, res){
      try {
        const productID = req.query.id;
    
        const product = await Productes.findById(productID);
        if (!product) return res.status(404).send('The product with the given ID was not found.');
       return res.json({ product });
      } catch (error) {
        res.status(500).send(error.message);
      }
    }



     function deleteproduct(req, res) {
      const productId = req.query.id;
      Productes.findByIdAndDelete(productId)
       .then(() => {
          res.status(200).json({ message: "Product deleted successfully" });
        })
       .catch((error) => {
          console.error(error);
          res.status(500).json({ message: "Server error" });
        });
    }

module.exports ={
    getuserordersdetails,
   getadmin,
   postproductcreat,
   getsingleproduct,
   deleteproduct
} ;