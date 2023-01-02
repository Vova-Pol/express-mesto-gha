const User = require("../models/user");

const badRequestErrCode = 400;
const notFoundErrCode = 404;
const serverErrCode = 500;

const getUsers = (req, res) => {
  User.find()
    .then((usersData) => {
      res.send({ data: usersData });
    })
    .catch(() => {
      res
        .status(serverErrCode)
        .send({ message: "Произошла ошибка на сервере" });
    });
};

const getUserById = (req, res) => {
  User.findById(req.params.userId)
    .then((userData) => {
      if (userData) {
        res.send({ data: userData });
      } else {
        res.status(notFoundErrCode).send({
          message: "Пользователь по указанному _id не найден",
        });
      }
    })
    .catch((err) => {
      if (err.name === "CastError") {
        res.status(badRequestErrCode).send({
          message: "Передан некорректный _id пользователя",
        });
      } else {
        res
          .status(serverErrCode)
          .send({ message: "Произошла ошибка на сервере" });
      }
    });
};

const postUser = (req, res) => {
  const { name, about, avatar } = req.body;

  User.create({ name, about, avatar })
    .then((newUser) => {
      res.send({ data: newUser });
    })
    .catch((err) => {
      if (err.name === "ValidationError") {
        res.status(badRequestErrCode).send({
          message: "Переданы некорректные данные при создании пользователя",
        });
      } else {
        res
          .status(serverErrCode)
          .send({ message: "Произошла ошибка на сервере" });
      }
    });
};

const patchUserInfo = (req, res) => {
  const { name, about } = req.body;
  const newInfo = {};

  if (name && about) {
    newInfo.name = name;
    newInfo.about = about;
  } else if (name) {
    newInfo.name = name;
  } else if (about) {
    newInfo.about = about;
  }

  User.findByIdAndUpdate(req.user._id, newInfo, {
    new: true,
    runValidators: true,
  })
    .then((newData) => {
      res.send({ data: newData });
    })
    .catch((err) => {
      if (err.name === "ValidationError") {
        res.status(badRequestErrCode).send({
          message: " Переданы некорректные данные при обновлении профиля",
        });
      } else if (err.name === "CastError") {
        res.status(notFoundErrCode).send({
          message: "Пользователь с указанным _id не найден",
        });
      } else {
        res
          .status(serverErrCode)
          .send({ message: "Произошла ошибка на сервере" });
      }
    });
};

const patchUserAvatar = (req, res) => {
  User.findByIdAndUpdate(
    req.user._id,
    { avatar: req.body.avatar },
    { new: true, runValidators: true }
  )
    .then((newData) => {
      res.send({ data: newData });
    })
    .catch((err) => {
      if (err.name === "ValidationError") {
        res.status(badRequestErrCode).send({
          message: "Переданы некорректные данные при обновлении аватара",
        });
      } else if (err.name === "CastError") {
        res.status(notFoundErrCode).send({
          message: "Пользователь с указанным _id не найден",
        });
      } else {
        res
          .status(serverErrCode)
          .send({ message: "Произошла ошибка на сервере" });
      }
    });
};

module.exports = {
  getUsers,
  postUser,
  getUserById,
  patchUserInfo,
  patchUserAvatar,
};
