// ============ User define imports Start ================

const  Payment  = require("../models/payment");
const Productes  = require("../models/productes");


// ============ User define imports end  ================

// ============ post personal function Start ================

async function postpersonal(req, res) {
    try {
        const data = req.body;
        const productId = req.query.id;
    //     const validateForm = (data) => {
    //         const errors = [];
    //         if (!data.first_name) errors.push("First name is required.");
    //         if (!data.last_name) errors.push("Last name is required.");
    // // Add a check before calling match
    //         if (!data.card_Number || !data.card_Number.match(/^\d{16}$/)) {
    //             errors.push("Card number must be 16 digits.");
    //         }
    //         if (!data.expiry || !data.expiry.match(/^\d{2}\/\d{2}$/)) {
    //             errors.push("Expiry must be in MM/YY format.");
    //         }
    //         if (!data.cvv || !data.cvv.match(/^\d{3}$/)) {
    //             errors.push("CVV must be 3 digits.");
    //         }

    //         return errors;
    //     };
    //     const errors = validateForm(data);
    //     if (!productId) errors.push("Product ID is required.");

    //     // If errors exist, return them
    //     if (errors.length > 0) {
    //         return res.status(400).json({ errors });
    //     }

        // Preprocess data
        const processedData = {
            productID: productId,
            ...data,
            
        };
        

        // Insert into database
        const personalData = await Payment.create(processedData);

        await Payment.insertMany(personalData)
        res.redirect("/home");
    } catch (err) {
        console.error("Database insert error:", err);

        if (err.name === "ValidationError") {
            const validationErrors = Object.values(err.errors).map((error) => error.message);
            return res.status(400).json({ errors: validationErrors });
        }

        res.status(500).json({ error: "An internal server error occurred." });
    }
}

// ============ post personal function end ================


// ============ get personal function Start ================

async function getpersonal(req, res)  {
    const productId = req.query.id;
    const adults_no = req.query.adults_no;
    const kids_no = req.query.kids_no;
    const check_in = req.query.check_in;
    const check_out = req.query.check_out;
    const days_count = req.query.days_count;
    const total_no = req.query.total_no;
    const totalCost = req.query.totalCost;
    try{  
       // Fetch the product details from the database
       const products = await Productes.findById(productId);  
        if (!products) {
            return res.status(404).json({ error: "Product not found" });
        }
    
      // Return product data as JSON
        const producte = ({
            id: products.id,
            title: products.title,
            price: products.price,
            adultBaseprice: products.adultBaseprice,
            kidsBaseprice: products.kidsBaseprice,
            dayBaseprice: products.dayBaseprice,
            thumbnail: products.thumbnail,
        });
   
        const product = ({
            productId : req.query.id,
            adults_no : req.query.adults_no,
            kids_no : req.query.kids_no,
            check_in : req.query.check_in,
            check_out : req.query.check_out,
            days_count : req.query.days_count,
            totalCost : req.query.totalCost,
       }); 
       const cartItem = {
            productId,
            adults_no,
            kids_no,
            check_in,
            check_out,
            days_count,
            totalCost,
            total_no,
            ...producte,
        };
        
        if (!req.session.cart) {
            req.session.cart = [];
        }
        
        const itemIndex = req.session.cart.findIndex(item => item.productId === productId);
        
        if (itemIndex === -1) {
            // Item does not exist, add it
            req.session.cart.push(cartItem);
        } else {
            // Update the existing item (if needed)
            req.session.cart[itemIndex] = cartItem;
        }
        // Render the cart with all session items
        res.render('cart', { cart: req.session.cart });
      //  res.render('cart',{ product,producte });
        } catch (error) {
    
        console.error("Error fetching product data:", error);
        res.status(500).json({ error: "Internal server error" });
        }
    
  }


// ============ get personal function end ================

// ============== Module Exports ================

module.exports = {
    postpersonal,
    getpersonal
};
  