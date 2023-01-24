const { Error } = require('mongoose');
const User = require('../models/user');
const Card = require('../models/card');
const NotFoundErr = require('../errors/not-found-error');
const BadRequestErr = require('../errors/bad-request-error');

// --- Handle Users Requests

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

// --- Handle Cards Requests

function handleCardLike(req, res, next, isLiked) {
  let updateConfig;
  let castErrorMessage;

  if (!isLiked) {
    updateConfig = { $addToSet: { likes: req.user._id } };
    castErrorMessage = 'постановки';
  } else if (isLiked) {
    updateConfig = { $pull: { likes: req.user._id } };
    castErrorMessage = 'снятия';
  } else {
    console.error(
      'Что-то не так в контроллере постановки/снятия лайка карточки',
    );
    return;
  }

  Card.findByIdAndUpdate(req.params.cardId, updateConfig, { new: true })
    .then((newData) => {
      if (newData) {
        res.send({ data: newData });
      } else {
        next(new NotFoundErr('Передан несуществующий _id карточки'));
      }
    })
    .catch((err) => {
      if (err instanceof Error.CastError) {
        next(
          new BadRequestErr(
            `Переданы некорректные данные для ${castErrorMessage} лайка`,
          ),
        );
      } else {
        next(err);
      }
    });
}

module.exports = { getUser, updateUserProfile, handleCardLike };
