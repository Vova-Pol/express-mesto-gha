const User = require('../models/user');
const NotFoundErr = require('../errors/not-found-error');
const BadRequestErr = require('../errors/bad-request-error');

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

module.exports = { getUser };
