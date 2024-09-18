const mongoose = require("mongoose");
require("dotenv").config();

const url = process.env.MONGO_URL;

const connectToDB = mongoose
  .connect(url,{
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverSelectionTimeoutMS: 10000, // 10 seconds timeout for connection
    socketTimeoutMS: 45000, // Socket timeout
    family: 4, // Use IPv4, since IPv6 can cause connection issues
  })
  .then(() => {
    console.log("Db Connected Successfully..✅"); 
  })
  .catch((error) => {
    console.log(console.log(error.message),"Faiiled To Connect Db...❌");
  }); 

module.exports = connectToDB;
