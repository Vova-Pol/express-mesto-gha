const Card = require("../models/card");

const getCards = (req, res) => {
  Card.find()
    .then((cardsData) => {
      res.send(cardsData);
    })
    .catch((err) => {
      res.status(500).send({ message: `Произошла ошибка: ${err}` });
    });
};

const postCard = (req, res) => {
  const { name, link } = req.body;

  Card.create({ name: name, link: link, owner: req.user._id })
    .then((newCard) => {
      res.send(newCard);
    })
    .catch((err) => {
      if (err.name === "ValidationError") {
        res.status(400).send({ message: "Переданы некорректные данные" });
        return;
      }

      res.status(500).send({ message: `Произошла ошибка: ${err}` });
    });
};

const deleteCard = (req, res) => {
  Card.findByIdAndRemove(req.params.cardId)
    .then((cardData) => {
      res.send(cardData);
    })
    .catch((err) => {
      if (err.name === "CastError") {
        res.status(404).send({
          message: "Запрашиваемая карточка не найдена",
        });
        return;
      }

      res.status(500).send({ message: `Произошла ошибка: ${err}` });
    });
};

const putLike = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true }
  )
    .then((newData) => {
      res.send(newData);
    })
    .catch((err) => {
      if (err.name === "CastError") {
        res.status(404).send({
          message: "Запрашиваемая карточка не найдена",
        });
        return;
      }

      res.status(500).send({ message: `Произошла ошибка: ${err}` });
    });
};

const deleteLike = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true }
  )
    .then((newData) => {
      res.send(newData);
    })
    .catch((err) => {
      if (err.name === "CastError") {
        res.status(404).send({
          message: "Запрашиваемая карточка не найдена",
        });
        return;
      }

      res.status(500).send({ message: `Произошла ошибка: ${err}` });
    });
};

module.exports = { getCards, postCard, deleteCard, putLike, deleteLike };
