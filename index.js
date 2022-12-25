const express = require("express");
const mongoose = require("mongoose");
const router = require("./router.js");

const { PORT = 3000 } = process.env;
const DB_URL = "mongodb://localhost:27017/mestodb";

const app = express();

mongoose.connect(DB_URL, {
  useNewUrlParser: true,
});

app.use("/", router);
app.use("/users", router);

app.listen(PORT, () => {
  console.log("App is working on PORT " + PORT);
});
