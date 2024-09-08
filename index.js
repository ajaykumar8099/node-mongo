const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
require("dotenv").config();

const connectToDB = require("./config/db");
const userRoutes = require("./routes/user.routes");

const app = express();
app.use(express.json());
app.use(cors());
app.use(morgan("common"));
app.use(helmet());

app.use("/user", userRoutes);

const port = process.env.PORT || 3002;

app.listen(port, () => {
  console.log(`Server Is Listening at Port ${port}`);
});
