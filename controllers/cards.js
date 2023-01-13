const BadRequestErr = require('../errors/bad-request-error');
const NotFoundErr = require('../errors/not-found-error');
const Card = require('../models/card');

const getCards = (req, res, next) => {
  Card.find()
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
      if (err.name === 'ValidationError') {
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
  const cardData = await Card.findById(cardId);

  if (String(cardData.owner) === userId) {
    Card.findByIdAndRemove(cardId)
      .then((data) => {
        if (data) {
          res.send({ data });
        } else {
          throw new NotFoundErr('Карточка с указанным _id не найдена');
        }
      })
      .catch((err) => {
        if (err.name === 'CastError') {
          next(new BadRequestErr('Передан некорректный _id карточки'));
        } else {
          next(err);
        }
      });
  } else {
    res.send({ message: 'Вы не можете удалять чужие карточки' });
  }
};

const putLike = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .then((newData) => {
      if (newData) {
        res.send({ data: newData });
      } else {
        throw new NotFoundErr('Передан несуществующий _id карточки');
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(
          new BadRequestErr(
            'Переданы некорректные данные для постановки лайка',
          ),
        );
      } else {
        next(err);
      }
    });
};

const deleteLike = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .then((newData) => {
      if (newData) {
        res.send({ data: newData });
      } else {
        throw new NotFoundErr('Передан несуществующий _id карточки');
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(
          new BadRequestErr('Переданы некорректные данные для снятия лайка'),
        );
      } else {
        next(err);
      }
    });
};

module.exports = {
  getCards,
  postCard,
  deleteCard,
  putLike,
  deleteLike,
};
