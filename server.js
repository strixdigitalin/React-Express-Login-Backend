const express = require("express");
const mysql = require("mysql");
const app = express();
const db = require("./MySql_Connection");
const sequelize = require("./models/index");
// app.use(bodyParser.urlencoded({ extended: false }))
var cors = require('cors')
app.use(cors())
app.use(express.json({ limit: "50mb" }));
app.usecors = require('cors');

app.use(function (req, res, next) {
    console.log(req._parsedUrl.path, "----<<<<<<<<<<<Current ");
  res.header("Access-Control-Allow-Origin", "*");
  res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
  res.header("Access-Control-Allow-Headers", "x-access-token, Origin, X-Requested-With, Content-Type, Accept");
  next();
});



app.use("/user", require("./Controller/user"));




app.use(express.urlencoded());





app.listen(process.env.PORT||5000, () => {
    console.log("SERVER STARTED ON PORT -------------",process.env.PORT||5000);
  });