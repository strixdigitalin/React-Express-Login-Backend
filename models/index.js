const {Sequelize,DataTypes} = require("sequelize");

const sequelize = new Sequelize("u513114670_frlnc_username", "u513114670_frlnc_username", "Freelancer@123", {
  dialect: "mysql",
  host: "46.17.172.52",
});
sequelize.authenticate().then(()=>{
  console.log("connected Databas")
}).catch(e=>console.log(e,"<<Not connected"))

var db={}
db.Sequelize=Sequelize
db.sequelize=sequelize
console.log("hrere")
db.users=require("./user")(sequelize,DataTypes)
db.sequelize.sync().then((res)=>{
  console.log("sync",{force:false});
  }).catch(e=>console.log(e,"<<>>",inde))

module.exports = db;