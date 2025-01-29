// ============ User define imports Start ================

const  Productes  = require("../models/productes");

// ============ User define imports end  ================

// ============= get home function Start ===============

async function gethome(req, res) {
  try {
    // Fetch all products from the database
    const products = await Productes.find({});
    // console.log(products);
    
   // Fetch distinct cities along with their images
   const distinctCities = await Productes.aggregate([
    {
      $group: {
        _id: "$cityName",
        cityImage: { $first: "$cityImage" }, // Pick the first image for the city
      },
    },
    {
      $project: {
        cityName: "$_id",
        cityImage: 1,
        _id: 0,
      },
    },
  ]);

  // console.log("Distinct Cities with Images:", distinctCities);


    // Pass products to the template to render them in the view
    res.render("home", { products, distinctCities  });
  } catch (err) {
    console.log("Err on home page:", err);
    res.status(500).send("Internal Server Error");
  }
}

// ============= get home function end ===============

// ============= get product function Start ===============

async function getproduct(req, res) {
   const productId = req.query.id; // Directly get the `id` from query parameters

  try{  
     // Fetch the product details from the database
     const product = await Productes.findById(productId);  
    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }
    const id = product._id;
    const title = product.title;
    const price = product.price;
    const adultBaseprice= product.adultBaseprice;
    const kidsBaseprice = product.kidsBaseprice;
    const dayBaseprice = product.dayBaseprice;
    const thumbnail = product.thumbnail;
    const tourService = product.tourService;
    const duration = product.duration;
    const transportService = product.transportService;
    const pickUp = product.pickUp;
    const discription = product.discription;
    // Return product data as JSON
   const producte = ({
      id: id ,
      title: title,
      discription:discription,
      price: price,
      adultBaseprice: adultBaseprice,
      kidsBaseprice: kidsBaseprice,
      dayBaseprice: dayBaseprice,
      thumbnail: thumbnail,
      tourService:tourService,
      duration:duration,
      transportService:transportService,
      pickUp:pickUp,
    });
    // console.log(product);
       // Return JSON response
      //  res.json(producte);
      // console.log("Product data:", producte);
     res.render("product", { producte }); // Pass product data to the template

  } catch (error) {
    console.error("Error fetching product data:", error);
    res.status(500).json({ error: "Internal server error" });
  }

};

// ============= get product function end ===============


async function getCity(req, res) {
  const cityName = req.query.cityName;
  try {
    // Fetch the product details from the database
    const cities = await Productes.find({ cityName: cityName });
    // console.log(cities);
    
    if (!cities.length) {
      return res.status(404).json({ error: "No products found" });
    }
    res.render("city", { producte: cities , cityName });
  } catch (error) {
    console.error("Error fetching product data:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}



// ============= get remove from cart function Start ===============

function removefromcart (req, res) {
  const productId = req.query.productId;

  // Check if there's a cart and a productId is provided in the query parameters
  if (!req.session.cart || !productId) {
    // If there's no cart or productId is invalid, redirect to home
    return res.redirect('/api/home');
  }

  // Use filter to remove the product from the cart
  req.session.cart = req.session.cart.filter(item => item.productId !== productId);

  // Check if the cart is now empty
  if (req.session.cart.length === 0) {
    delete req.session.cart; // Clear the cart from the session
    return res.redirect('/api/home'); // Redirect to home or products page
  } else {

    // If the cart is not empty, redirect to the cart page
    return res.render('cart', { cart: req.session.cart });
  }

  // Render the updated cart
  // res.render('cart');
}

// ============= get remove from cart function end ===============


// ============== Module Exports ================

module.exports = {
  gethome,
  removefromcart,
  getproduct,
  getCity
};
