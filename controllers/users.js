const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const BadRequestErr = require('../errors/bad-request-error');
const NotFoundErr = require('../errors/not-found-error');
const ConflictErr = require('../errors/conflict-error');
const User = require('../models/user');

const getUsers = (req, res, next) => {
  User.find()
    .then((usersData) => {
      res.send({ data: usersData });
    })
    .catch(next);
};

const getUserById = (req, res, next) => {
  User.findById(req.params.userId)
    .then((userData) => {
      if (userData) {
        res.send({ data: userData });
      } else {
        throw new NotFoundErr('Пользователь по указанному _id не найден');
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequestErr('Передан некорректный _id пользователя'));
      } else {
        next(err);
      }
    });
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
    .then((newUser) => {
      res.send({ data: newUser });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
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
      if (newData) {
        res.send({ data: newData });
      } else {
        throw new NotFoundErr('Пользователь с указанным _id не найден');
      }
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(
          new BadRequestErr(
            'Переданы некорректные данные при обновлении профиля',
          ),
        );
      } else if (err.name === 'CastError') {
        next(new BadRequestErr('Передан некорректный _id пользователя'));
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
        throw new NotFoundErr('Пользователь с указанным _id не найден');
      }
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(
          new BadRequestErr(
            'Переданы некорректные данные при обновлении аватара',
          ),
        );
      } else if (err.name === 'CastError') {
        next(new BadRequestErr('Передан некорректный _id пользователя'));
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
  User.findById(req.user._id)
    .then((user) => {
      res.send({ data: user });
    })
    .catch(next);
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
