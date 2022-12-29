const Card = require("../models/card");

const getCards = (req, res) => {
  Card.find()
    .then((cardsData) => {
      res.send({ data: cardsData });
    })
    .catch((err) => {
      res.status(500).send({ message: `Произошла ошибка: ${err}` });
    });
};

const postCard = (req, res) => {
  const { name, link } = req.body;

  Card.create({ name: name, link: link, owner: req.user._id })
    .then((newCard) => {
      res.send({ data: newCard });
    })
    .catch((err) => {
      if (err.name === "ValidationError") {
        res.status(400).send({
          message: "Переданы некорректные данные при создании карточки",
        });
        return;
      }

      res.status(500).send({ message: `Произошла ошибка: ${err}` });
    });
};

const deleteCard = (req, res) => {
  Card.findByIdAndRemove(req.params.cardId)
    .then((cardData) => {
      cardData
        ? res.send({ data: cardData })
        : res.status(404).send({
            message: "Карточка с указанным _id не найдена",
          });
    })
    .catch((err) => {
      if (err.name === "CastError") {
        res.status(400).send({
          message: "Передан некорректный _id пользователя",
        });
        return;
      } else {
        res.status(500).send({ message: `Произошла ошибка: ${err}` });
      }
    });
};

const putLike = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true }
  )
    .then((newData) => {
      newData
        ? res.send({ data: newData })
        : res.status(404).send({
            message: "Передан несуществующий _id карточки",
          });
    })
    .catch((err) => {
      if (err.name === "CastError") {
        res.status(400).send({
          message: "Переданы некорректные данные для постановки лайка",
        });
        return;
      } else {
        res.status(500).send({ message: `Произошла ошибка: ${err}` });
      }
    });
};

const deleteLike = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true }
  )
    .then((newData) => {
      newData
        ? res.send({ data: newData })
        : res.status(404).send({
            message: "Передан несуществующий _id карточки",
          });
    })
    .catch((err) => {
      if (err.name === "CastError") {
        res.status(400).send({
          message: "Переданы некорректные данные для снятия лайка",
        });
        return;
      } else {
        res.status(500).send({ message: `Произошла ошибка: ${err}` });
      }
    });
};

module.exports = { getCards, postCard, deleteCard, putLike, deleteLike };
