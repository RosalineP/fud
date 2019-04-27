
const mongoose = require("mongoose");
const express = require("express");
var cors = require('cors');
const bodyParser = require("body-parser");
const logger = require("morgan");
const FridgeFood = require("./fridgeFood");
const Data = require("./data");

const API_PORT = 3001;
const app = express();
app.use(cors());
const router = express.Router();

const dbRoute = "mongodb+srv://user1:kirbsftwo3o@fudcluster-lpg62.mongodb.net/fud_db?retryWrites=true";

mongoose.connect(
  dbRoute,
  { useNewUrlParser: true }
);

let db = mongoose.connection;

db.once("open", () => console.log("connected to the database"));

db.on("error", console.error.bind(console, "MongoDB connection error:"));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(logger("dev"));


// ===================== fridgeView ==============================


router.post("/addFood", (req, res) => {
  var { name, expiry, compartment, icon, quantity, unit, price } = req.body;

  if (unit === null){
    var unit = "";
  }

  var newFood = new FridgeFood({
    name: name,
    expiry: expiry,
    compartment: compartment,
    icon: icon,
    quantity: quantity,
    unit: unit,
    price: price
  });

  newFood.save(err => {
    if (err) console.log(err);
    if (err) return res.json({ success: false, error: err });
    console.log("successful new food save")
    return res.json({ success: true });

  });
});


router.get("/getFood", (req, res) => {
  // FridgeFood.find({compartment: "fridge"}, (err, data) => {
  FridgeFood.find((err, data) => {
    if (err) return res.json({ success: false, error: err });
    return res.json({ success: true, data: data });
  });
});

router.delete("/deleteFood", (req, res) => {
  const { ids } = req.body;
  FridgeFood.deleteMany({ _id: { $in: ids}}, err => {
    if (err) return res.send(err);
    return res.json({ success: true });
  })

});

// =======================================================
app.use("/api", router);

app.listen(API_PORT, () => console.log(`LISTENING ON PORT ${API_PORT}`));
