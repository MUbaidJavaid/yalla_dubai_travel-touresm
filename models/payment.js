const mongoose = require("mongoose");
const paymentschema = new mongoose.Schema({
   productID: { 
      type: String,
      
    },
   title: { 
      type: String, 
      required: true
    },
   adults_no: { 
      type: Number, 
      required: true
    },
   kids_no: { 
      type: Number, 
      required: true
    },
   totalCost: { 
      type: Number, 
      required: true
    },
   first_name: { 
      type: String, 
      required: true
    },
   last_name: { 
      type: String, 
      required: true
    },
   address: { 
      type: String, 
      required: true
    },
   payment_Method: { 
      type: String, 
      required: true
   }, 
   city: { 
      type: String, 
      required: true
    },
   state: { 
      type: String, 
      required: true
    }, 
   country: { 
      type: String, 
      required: true
    },
   name_On_Card: { 
      type: String, 
      required: true
    },
   card_Number: { 
      type: String, 
      required: true
    },
   zip: { 
      type: Number, 
      required: true
    },
   expiry: { 
      type: String, 
      required: true
    }, 
   cvv: { 
      type: String, 
      required: true
    },
});


const Payment = mongoose.model("Payment", paymentschema);
module.exports = Payment;