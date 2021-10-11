const express = require("express");
const app = express.Router();
// const db = require("");

app.post("user",require("./Controller/user"))

module.exports=app