const Sequelize = require("sequelize");

const sequelize = new Sequelize("u513114670_frlnc_username", "u513114670_frlnc_username", "Freelancer@123", {
  dialect: "mysql",
  host: "46.17.172.52",
});
sequelize.authenticate().then(()=>{
  console.log("connected Databas")
}).catch(e=>console.log(e,"<<Not connected"))

const db={}
db.Sequelize=Sequelize
db.sequelize=sequelize
db.users=require("./models/user")

db.sequelize.sync().then((res)=>{
  console.log("sync");
  }).catch(e=>console.log(e,"<<>>, seq"))
module.exports = sequelize;