const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  id: {
    type: Number,
    default: true,
  },
  cityName:  {
    type: String,
    required: true
  },
  cityImage:  {
    type: String,
    required: true
  },
  tourService: {
    type: String,
    required: true
  },
  duration: {
    type: String,
    required: true
  },
  transportService:  {
    type: String,
    required: true
  },
  pickUp:  {
    type: String,
    required: true
  },
  title: {
    type: String,
    required: true
  },
  discription:{
    type:String,
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
    type: [String],
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
