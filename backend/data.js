
// /backend/data.js
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// this will be our data base's data structure
// const DataSchema = new Schema(
//   {
//     id: Number,
//     message: String
//   },
//   { timestamps: true }
// );
// // export the new Schema so we could modify it using Node.js
// module.exports = mongoose.model("quotes", DataSchema);


const FridgeSchema = new Schema(
  {
    compartment: String,

    foods:
    [{
      name: String,
      date: String
    }]
  }
);

module.exports = mongoose.model("Fridge", FridgeSchema);
