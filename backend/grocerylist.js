
// /backend/data.js
const mongoose = require("mongoose");
const Schema = mongoose.Schema;


const GroceryList = new Schema(
  {
    username: String,
    listfoods: [{type:String}]
  }
);

module.exports = mongoose.model("Shop", GroceryList);
