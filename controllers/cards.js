const { Error } = require('mongoose');
const BadRequestErr = require('../errors/bad-request-error');
const NotFoundErr = require('../errors/not-found-error');
const ForbiddenErr = require('../errors/forbidden-error');
const Card = require('../models/card');
const { handleCardLike } = require('../utils/utils');

const getCards = (req, res, next) => {
  Card.find()
    .populate(['owner', 'likes'])
    .then((cardsData) => {
      res.send({ data: cardsData });
    })
    .catch(next);
};

const postCard = (req, res, next) => {
  const { name, link } = req.body;

  Card.create({ name, link, owner: req.user._id })
    .then((newCard) => {
      res.send({ data: newCard });
    })
    .catch((err) => {
      if (err instanceof Error.ValidationError) {
        next(
          new BadRequestErr(
            'Переданы некорректные данные при создании карточки',
          ),
        );
      } else {
        next(err);
      }
    });
};

const deleteCard = async (req, res, next) => {
  const { cardId } = req.params;
  const userId = req.user._id;
  let cardData;
  try {
    cardData = await Card.findById(cardId);

    if (!cardData) {
      next(new NotFoundErr('Карточка с указанным _id не найдена'));
    } else if (String(cardData.owner) === userId) {
      cardData
        .remove()
        .then((data) => {
          res.send({ data });
        })
        .catch(next);
    } else {
      next(new ForbiddenErr('Вы не можете удалять чужие карточки'));
    }
  } catch (err) {
    if (err instanceof Error.CastError) {
      next(new BadRequestErr('Передан некорректный _id карточки'));
    } else {
      next(err);
    }
  }
};

const putLike = (req, res, next) => {
  handleCardLike(req, res, next, 'like');
};

const deleteLike = (req, res, next) => {
  handleCardLike(req, res, next, 'dislike');
};

module.exports = {
  getCards,
  postCard,
  deleteCard,
  putLike,
  deleteLike,
};
