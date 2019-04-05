
const mongoose = require("mongoose");
const express = require("express");
var cors = require('cors');
const bodyParser = require("body-parser");
const logger = require("morgan");
const Data = require("./data");

const API_PORT = 3001;
const app = express();
app.use(cors());
const router = express.Router();

// this is our MongoDB database
const dbRoute = "mongodb+srv://user1:kirbsftwo3o@fudcluster-lpg62.mongodb.net/fud_db?retryWrites=true";

// connects our back end code with the database
mongoose.connect(
  dbRoute,
  { useNewUrlParser: true }
);

let db = mongoose.connection;

db.once("open", () => console.log("connected to the database"));

// checks if connection with the database is successful
db.on("error", console.error.bind(console, "MongoDB connection error:"));

// (optional) only made for logging and
// bodyParser, parses the request body to be a readable json format
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(logger("dev"));


// =======================================================

// this is our get method
// this method fetches all available data in our database
router.get("/getData", (req, res) => {
  Data.find((err, data) => {
    if (err) return res.json({ success: false, error: err });
    return res.json({ success: true, data: data });
  });
});

// this is our create methid
// this method adds new data in our database
router.post("/putData", (req, res) => {
  let data = new Data();
  const { compartment, name, date } = req.body;
  console.log(req.body); // : { compartment: 'cheese', name: 'ass', date: 'never' }

  if ((!name && name !== 0) || !date) {
    return res.json({
      success: false,
      error: "INVALID INPUTS"
    });
  }

  var food = [];
  food.push({})
  data.compartment = compartment;
  // data.foods.name = name;
  // data.foods.date = date;
  data.foods.push({name: name, date:date})


  data.save(err => {
    if (err) return res.json({ success: false, error: err });
    console.log("successful new food save")
    return res.json({ success: true });
  });
});



// =======================================================


// append /api for our http requests
app.use("/api", router);

// launch our backend into a port
app.listen(API_PORT, () => console.log(`LISTENING ON PORT ${API_PORT}`));
