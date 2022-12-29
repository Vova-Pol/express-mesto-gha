const User = require("../models/user");

const getUsers = (req, res) => {
  User.find()
    .then((usersData) => {
      res.send({ data: usersData });
    })
    .catch((err) => {
      res.status(500).send({ message: `Произошла ошибка: ${err}` });
    });
};

const getUserById = (req, res) => {
  User.findById(req.params.userId)
    .then((userData) => {
      userData
        ? res.send({ data: userData })
        : res.status(404).send({
            message: "Пользователь по указанному _id не найден",
          });
    })
    .catch((err) => {
      if (err.name === "CastError") {
        res.status(400).send({
          message: "Передан некорректный _id пользователя",
        });
        return;
      } else {
        res.status(500).send({ message: `Произошла ошибка: ${err}` });
      }
    });
};

const postUser = (req, res) => {
  const { name, about, avatar } = req.body;

  User.create({ name: name, about: about, avatar: avatar })
    .then((newUser) => {
      res.send({ data: newUser });
    })
    .catch((err) => {
      if (err.name === "ValidationError") {
        res.status(400).send({
          message: "Переданы некорректные данные при создании пользователя",
        });
        return;
      }

      res.status(500).send({ message: `Произошла ошибка: ${err}` });
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
        res.status(400).send({
          message: " Переданы некорректные данные при обновлении профиля",
        });
        return;
      } else if (err.name === "CastError") {
        res.status(404).send({
          message: "Пользователь с указанным _id не найден",
        });
        return;
      }

      res.status(500).send({ message: `Произошла ошибка: ${err}` });
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
        res.status(400).send({
          message: "Переданы некорректные данные при обновлении аватара",
        });
        return;
      } else if (err.name === "CastError") {
        res.status(404).send({
          message: "Пользователь с указанным _id не найден",
        });
        return;
      }

      res.status(500).send({ message: `Произошла ошибка: ${err}` });
    });
};

module.exports = {
  getUsers,
  postUser,
  getUserById,
  patchUserInfo,
  patchUserAvatar,
};
