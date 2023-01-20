const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { Error } = require('mongoose');
const BadRequestErr = require('../errors/bad-request-error');
const NotFoundErr = require('../errors/not-found-error');
const ConflictErr = require('../errors/conflict-error');
const User = require('../models/user');
const { getUser } = require('../utils/utils');

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
  const { email, password, name, about, avatar } = req.body;

  bcrypt
    .hash(password, 10)
    .then((hash) =>
      User.create({
        email,
        password: hash,
        name,
        about,
        avatar,
      }),
    )
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
  const newInfo = {};

  if (name) {
    newInfo.name = name;
  }
  if (about) {
    newInfo.about = about;
  }

  User.findByIdAndUpdate(req.user._id, newInfo, {
    new: true,
    runValidators: true,
  })
    .then((newData) => {
      if (newData) {
        res.send({ data: newData });
      } else {
        next(new NotFoundErr('Пользователь с указанным _id не найден'));
      }
    })
    .catch((err) => {
      if (err instanceof Error.ValidationError) {
        next(
          new BadRequestErr(
            'Переданы некорректные данные при обновлении профиля',
          ),
        );
      } else {
        next(err);
      }
    });
};

const patchUserAvatar = (req, res, next) => {
  User.findByIdAndUpdate(
    req.user._id,
    { avatar: req.body.avatar },
    { new: true, runValidators: true },
  )
    .then((newData) => {
      if (newData) {
        res.send({ data: newData });
      } else {
        next(new NotFoundErr('Пользователь с указанным _id не найден'));
      }
    })
    .catch((err) => {
      if (err instanceof Error.ValidationError) {
        next(
          new BadRequestErr(
            'Переданы некорректные данные при обновлении аватара',
          ),
        );
      } else {
        next(err);
      }
    });
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

/* Не уверен, правильно ли я использую функции-декораторы.
По той же логике можно вынести обновление данных пользователя.  */

module.exports = {
  getUsers,
  postUser,
  getUserById,
  patchUserInfo,
  patchUserAvatar,
  login,
  getCurrentUser,
};
