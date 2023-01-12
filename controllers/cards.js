const Card = require('../models/card');

const badRequestErrCode = 400;
const notFoundErrCode = 404;
const serverErrCode = 500;

const getCards = (req, res) => {
  Card.find()
    .then((cardsData) => {
      res.send({ data: cardsData });
    })
    .catch(() => {
      res.status(serverErrCode).send({
        message: 'Произошла ошибка на сервере',
      });
    });
};

const postCard = (req, res) => {
  const { name, link } = req.body;

  Card.create({ name, link, owner: req.user._id })
    .then((newCard) => {
      res.send({ data: newCard });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(badRequestErrCode).send({
          message: 'Переданы некорректные данные при создании карточки',
        });
        return;
      }

      res.status(serverErrCode).send({
        message: 'Произошла ошибка на сервере',
      });
    });
};

const deleteCard = async (req, res) => {
  const { cardId } = req.params;
  const userId = req.user._id;
  const cardData = await Card.findById(cardId);

  if (String(cardData.owner) === userId) {
    console.log('You are in');
    Card.findByIdAndRemove(cardId)
      .then((data) => {
        if (data) {
          res.send({ data });
        } else {
          res.status(notFoundErrCode).send({
            message: 'Карточка с указанным _id не найдена',
          });
        }
      })
      .catch((err) => {
        if (err.name === 'CastError') {
          res.status(badRequestErrCode).send({
            message: 'Передан некорректный _id карточки',
          });
        } else {
          res.status(serverErrCode).send({
            message: 'Произошла ошибка на сервере',
          });
        }
      });
  } else {
    res.send({ message: 'Вы не можете удалять чужие карточки' });
  }
};

const putLike = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .then((newData) => {
      if (newData) {
        res.send({ data: newData });
      } else {
        res.status(notFoundErrCode).send({
          message: 'Передан несуществующий _id карточки',
        });
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(badRequestErrCode).send({
          message: 'Переданы некорректные данные для постановки лайка',
        });
      } else {
        res.status(serverErrCode).send({
          message: 'Произошла ошибка на сервере',
        });
      }
    });
};

const deleteLike = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .then((newData) => {
      if (newData) {
        res.send({ data: newData });
      } else {
        res.status(notFoundErrCode).send({
          message: 'Передан несуществующий _id карточки',
        });
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(badRequestErrCode).send({
          message: 'Переданы некорректные данные для снятия лайка',
        });
      } else {
        res.status(serverErrCode).send({
          message: 'Произошла ошибка на сервере',
        });
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
