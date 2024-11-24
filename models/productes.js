// const mongoose = require("mongoose");

// const Productesschema = new mongoose.Schema({
//   _id: {
//      type: String,
//   },
//   title: {
//     type: String,
//   },
//   price: {
//     type: Number,
//   },
//   thumbnail: {
//     type: String,
//   },
// });

// const Productes = new mongoose.model("Product", Productesschema);
// module.exports = {
//   Productes,
// };



// ========
const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  id: {
    type: Number,
    required: true,
    unique: true
  },
  title: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  quantity: {
    type: Number,
    required: true
  },
  total: {
    type: Number,
    required: true
  },
  discountPercentage: {
    type: Number,
    required: true
  },
  discountedTotal: {
    type: Number,
    required: true
  },
  thumbnail: {
    type: String,
    required: true,
    validate: {
      validator: function(url) {
        return /^(ftp|http|https):\/\/[^ "]+$/.test(url);
      },
      message: props => `${props.value} is not a valid URL`
    }
  },
  adultBaseprice:{
    type: Number,
    required: true
  },
  kidsBaseprice:{
    type: Number,
    required: true
  },
  dayBaseprice:{
    type: Number,
    required: true
  }
});

const Productes = mongoose.model("Product", productSchema);
module.exports = Productes;
