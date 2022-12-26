const User = require("./models/user");

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

module.exports = { getUsers, postUser, getUserById };
