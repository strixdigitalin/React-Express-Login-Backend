const { createPool } = require("mysql");

var db = createPool({
  host: "46.17.172.52",
  user: "u513114670_frlnc_username",
  password: "Freelancer@123",
  database: "u513114670_frlnc_username",
  connectionLimit: 2,

});

db.getConnection((err, connection) => {
  if (err) {
    // throw err.
    console.log(err,"error mysql");
  } else {
   
    console.log(
  
      "DATABASE CONNECTED--------->>SQL<<<<"
    );
  }


  // console.log("DATABASE CONNECTED--------->>SQL");
});
module.exports = db;
