const mongoose = require("mongoose");
require("dotenv").config();

const url = process.env.MONGO_URL;

const connectToDB = mongoose
  .connect(url)
  .then(() => {
    console.log("Db Connected Successfully..✅");
  })
  .catch((error) => {
    console.log("Faiiled To Connect Db...❌");
  });

module.exports = connectToDB;
