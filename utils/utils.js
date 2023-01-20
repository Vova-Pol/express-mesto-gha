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

// --- Handle Cards Requests

function handleCardLike(req, res, next, action) {
  let updateConfig;
  let castErrorMessage;

  if (action === 'like') {
    updateConfig = { $addToSet: { likes: req.user._id } };
    castErrorMessage = 'постановки';
  } else if (action === 'dislike') {
    updateConfig = { $pull: { likes: req.user._id } };
    castErrorMessage = 'снятия';
  } else {
    console.log('аргумент action не определен или определен неверно');
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

module.exports = { getUser, handleCardLike };
