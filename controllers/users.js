const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { Error } = require('mongoose');
const BadRequestErr = require('../errors/bad-request-error');
const NotFoundErr = require('../errors/not-found-error');
const ConflictErr = require('../errors/conflict-error');
const User = require('../models/user');

function getUser(req, res, next, userId) {
  User.findById(userId)
    .then((userData) => {
      if (userData) {
        res.send({ data: userData });
      } else {
        next(new NotFoundErr('Пользователь по указанному _id не найден'));
      }
    })
    .catch((err) => {
      if (err instanceof Error.CastError) {
        next(new BadRequestErr('Передан некорректный _id пользователя'));
      } else {
        next(err);
      }
    });
}

function updateUserProfile(req, res, next, userId, newData, errText) {
  User.findByIdAndUpdate(userId, newData, {
    new: true,
    runValidators: true,
  })
    .then((data) => {
      if (data) {
        res.send({ data });
      } else {
        next(new NotFoundErr('Пользователь с указанным _id не найден'));
      }
    })
    .catch((err) => {
      if (err instanceof Error.ValidationError) {
        next(
          new BadRequestErr(
            `Переданы некорректные данные при обновлении ${errText}`,
          ),
        );
      } else {
        next(err);
      }
    });
}

const getUsers = (req, res, next) => {
  User.find()
    .then((usersData) => {
      res.send({ data: usersData });
    })
    .catch(next);
};

const getUserById = (req, res, next) => {
  const { userId } = req.params;
  getUser(req, res, next, userId);
};

const postUser = (req, res, next) => {
  const {
    email, password, name, about, avatar,
  } = req.body;

  bcrypt
    .hash(password, 10)
    .then((hash) => User.create({
      email,
      password: hash,
      name,
      about,
      avatar,
    }))
    .then((data) => {
      const newUser = JSON.parse(JSON.stringify(data));
      delete newUser.password;
      res.send({ data: newUser });
    })
    .catch((err) => {
      if (err instanceof Error.ValidationError) {
        next(
          new BadRequestErr(
            'Переданы некорректные данные при создании пользователя',
          ),
        );
      } else if (err.code === 11000) {
        next(new ConflictErr('Пользователь с таким email уже существует'));
      } else {
        next(err);
      }
    });
};

const patchUserInfo = (req, res, next) => {
  const { name, about } = req.body;
  const newData = { name, about };
  const userId = req.user._id;

  updateUserProfile(req, res, next, userId, newData, 'профиля');
};

const patchUserAvatar = (req, res, next) => {
  const newData = { avatar: req.body.avatar };
  const userId = req.user._id;

  updateUserProfile(req, res, next, userId, newData, 'аватара');
};

const login = (req, res, next) => {
  const { email, password } = req.body;

  User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, 'secret-key', {
        expiresIn: '7d',
      });
      res.send({ token });
    })
    .catch(next);
};

const getCurrentUser = (req, res, next) => {
  const userId = req.user._id;
  getUser(req, res, next, userId);
};

module.exports = {
  getUsers,
  postUser,
  getUserById,
  patchUserInfo,
  patchUserAvatar,
  login,
  getCurrentUser,
};
