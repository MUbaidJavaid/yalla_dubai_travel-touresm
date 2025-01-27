const mongoose = require("mongoose");
const paymentschema = new mongoose.Schema({
   products: { 
      type: Array,
      required: true     
    },
    userId: { 
      type: String,     
    },
    userName: {
      type: String,     
    },
    userEmail: {
      type: String,     
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
   date:{
      type: Date,
   }
});


const Payment = mongoose.model("Payment", paymentschema);
module.exports = Payment;