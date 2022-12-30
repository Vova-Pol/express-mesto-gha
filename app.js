const express = require("express");
const mongoose = require("mongoose");
const router = require("./router.js");

const { PORT = 3000 } = process.env;
const DB_URL = "mongodb://localhost:27017/mestodb";

const app = express();

const bodyParser = require("body-parser");
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use((req, res, next) => {
  req.user = {
    _id: "63a86aec35e239f3ab163d09",
  };

  next();
});

app.use("/", router);
app.use("/users", router);
app.use("/cards", router);
app.use("*", (req, res) => {
  res.status(404).send({ message: "Такой страницы не существует" });
});

async function startApp() {
  try {
    await mongoose.connect(DB_URL, {
      useNewUrlParser: true,
    });

    app.listen(PORT, () => {
      console.log("App is working on PORT " + PORT);
    });
  } catch (err) {
    console.log("Произошла ошибка при запуске приложения: " + err);
  }
}

startApp();

module.exports.createCard = (req, res) => {
  console.log(req.user._id);
};
