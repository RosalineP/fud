const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const FridgeSchema = new Schema(
  {
    name: String,
    expiry: String,
    compartment: String,
    icon: String
  }
);

module.exports = mongoose.model("FridgeFood", FridgeSchema);
