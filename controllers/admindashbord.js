
const Payment = require("../models/payment");
 const collection = require("../models/users");
const  Productes = require("../models/productes");
const fs = require('fs').promises;
// ============= admin get function Start ================

async function getadmin(req, res) {
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

 function  getadminproductadd(req, res){ 
  res.render('productdetail', { title: 'Product Detail' });
}


function  getadminproductupdate(req, res){
  res.render('editproduct', { title: 'Product Update' });

}


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

async function postproductcreat(req, res) {
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


    async function postproductupdate(req, res) {

      try {
        // const productId = req.query.id;
        const productId =  "6798b6813d59bdbfff091f28";
        if (!productId) {
          return res.status(400).json({ message: "Invalid product id" });
        }
        const { 
          cityName, citydescription, tourService, duration, transportService, pickUp, producttitle, discountPercentage, discountedtotal, price, prime, nonprime, privatetransferprice,   quantity,  productdescription,  privatetransferperson,  categorie,  adultBaseprice,  kidsBaseprice,  translatelanguage, wifi, } = req.body;
    
          let cityImage = "";
          let thumbnail = [];
    
          // Correct: Use req.files.cityImage (matches Multer's field name)
          if (req.files && req.files.cityImage) {
            cityImage = req.files.cityImage[0].filename; // [0] because maxCount: 1
          }
    
          if (req.files && req.files.thumbnail) {
            thumbnail = req.files.thumbnail.map(file => file.filename);
          }
          // If no new thumbnails, retain existing ones from the database
          else {
            thumbnail = req.body.thumbnail || [];
          }
    
          const deleteOldFiles = async () => {
            try {
              // Delete old cityImage if it exists and a new one is uploaded
              if (req.body.existingCityImage && req.files.cityImage) {
                await fs.unlink(`./uploads/${req.body.existingCityImage}`);
                console.log(`Deleted old city image: ${req.body.existingCityImage}`);
              }
          
              // Delete old thumbnails if new ones are uploaded
              if (req.body.existingThumbnails && req.files.thumbnail) {
                for (const oldThumbnail of req.body.existingThumbnails) {
                  await fs.unlink(`./uploads/${oldThumbnail}`);
                  console.log(`Deleted old thumbnail: ${oldThumbnail}`);
                }
              }
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
    }

module.exports ={
    getuserordersdetails,
   getadmin,
   postproductcreat,
   getsingleproduct,
   deleteproduct,
   postproductupdate,
   getadminproductadd,
   getadminproductupdate
} ;