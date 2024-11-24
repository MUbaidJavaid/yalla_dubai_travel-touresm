const  Productes  = require("../models/productes");

// get home
async function gethome(req, res) {
  try {
    // Fetch all products from the database
    const products = await Productes.find({});


    // Pass products to the template to render them in the view
    res.render("home", { products });
  } catch (err) {
    console.log("Err on home page:", err);
    res.status(500).send("Internal Server Error");
  }
}

// get home
async function postaddtocart(req, res) {
  try {
    // Fetch all products from the database
    const product = await Productes.find({ product: req.body.product });
// console.log("hi");

    if (!req.session.cart) {
      req.session.cart = []; // Initialize cart if it doesn't exist
    }

    req.session.cart.push(product); // Add product to the session cart
    res.json({ message: "Product added to cart", cart: req.session.cart });
    // Find product by thumbnail
    // const product = await Productes.findOne({ thumbnail: req.thumbnail }) || {}; // Fallback to an empty object if null
    // console.log("Thumbnail received:", req.thumbnail);

    // // Render the template with the product
    // res.render("addtocart", { product });
  } catch (err) {
    console.log("Err on cart page:", err);
    res.status(500).send("Internal Server Error");
  }
}

module.exports = {
  gethome,
  postaddtocart,
};
