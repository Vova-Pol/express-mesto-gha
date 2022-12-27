const User = require("../models/user");

const getUsers = (req, res) => {
  User.find()
    .then((usersData) => {
      res.send(usersData);
    })
    .catch((err) => {
      res.status(500).send({ message: `Произошла ошибка: ${err}` });
    });
};

const getUserById = (req, res) => {
  User.findById(req.params.userId)
    .then((userData) => res.send(userData))
    .catch((err) => {
      res.status(500).send({ message: `Произошла ошибка: ${err}` });
    });
};

const postUser = (req, res) => {
  const { name, about, avatar } = req.body;

  User.create({ name: name, about: about, avatar: avatar })
    .then((newUser) => {
      res.send(newUser);
    })
    .catch((err) => {
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
  } else {
    res.send("Ошибка в условной контрукции в patchUserInfo()");
  }

  User.findByIdAndUpdate(req.user._id, newInfo, { new: true })
    .then((newData) => {
      res.send(newData);
    })
    .catch((err) => {
      res.status(500).send({ message: `Произошла ошибка: ${err}` });
    });
};

const patchUserAvatar = (req, res) => {
  User.findByIdAndUpdate(
    req.user._id,
    { avatar: req.body.avatar },
    { new: true }
  )
    .then((newData) => {
      res.send(newData);
    })
    .catch((err) => {
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
