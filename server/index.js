const express = require('express');
const path = require('path');
const cluster = require('cluster');
const numCPUs = require('os').cpus().length;

const mongoose = require("mongoose");
var cors = require('cors');
const logger = require("morgan");
const bodyParser = require("body-parser");
const router = express.Router();
const FridgeFood = require("./fridgeFood");

const isDev = process.env.NODE_ENV !== 'production';
const PORT = process.env.PORT || 5000;
var MONGODB_URI = process.env.MONGODB_URI || "mongodb://heroku_gs52jjxq:mgj5ujh2legpgiva89r2mouvn6@ds021289.mlab.com:21289/heroku_gs52jjxq"
const dbRoute =  "mongodb+srv://user1:kirbsftwo3o@fudcluster-lpg62.mongodb.net/fud_db?retryWrites=true";


// Multi-process to utilize all CPU cores.
if (!isDev && cluster.isMaster) {
  console.error(`Node cluster master ${process.pid} is running`);

  // Fork workers.
  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }

  cluster.on('exit', (worker, code, signal) => {
    console.error(`Node cluster worker ${worker.process.pid} exited: code ${code}, signal ${signal}`);
  });

} else {
  const app = express();
  app.use(cors());

  // Priority serve any static files.
  app.use(express.static(path.resolve(__dirname, '../react-ui/build')));

  // Answer API requests.
  app.get('/api', function (req, res) {
    res.set('Content-Type', 'application/json');
    res.send('{"message":"Hello from the custom server!"}');
  });

  mongoose.connect(
    MONGODB_URI,
    { useNewUrlParser: true }
  );

  let db = mongoose.connection;
  db.once("open", () => console.log("connected to the database"));
  db.on("error", console.error.bind(console, "MongoDB connection error:"));

  app.use(bodyParser.urlencoded({ extended: false }));
  app.use(bodyParser.json());
  app.use(logger("dev"));


  // ===================== fridgeView ==============================

  app.post("/addFood", (req, res) => {
    console.log("in server addfood")
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

  app.get("/getFood", (req, res) => {
    FridgeFood.find((err, data) => {
      if (err) return res.json({ success: false, error: err });
      console.log(data)
      return res.json({ success: true, data: data });
    });
  });


  app.delete("/deleteFood", (req, res) => {
    const { ids } = req.body;
    FridgeFood.deleteMany({ _id: { $in: ids}}, err => {
      if (err) return res.send(err);
      return res.json({ success: true });
    })

  });


  // =======================================================


  // All remaining requests return the React app, so it can handle routing.
  app.get('*', function(request, response) {
    response.sendFile(path.resolve(__dirname, '../react-ui/build', 'index.html'));
  });


  app.listen(PORT, function () {
    console.error(`Node ${isDev ? 'dev server' : 'cluster worker '+process.pid}: listening on port ${PORT}`);
  });
}
