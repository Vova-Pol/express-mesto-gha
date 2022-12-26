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
      res.status(500).send({ message: `Произошла ошибка: ${err}` });
    });
};

const deleteCard = (req, res) => {
  Card.findByIdAndRemove(req.params.cardId)
    .then((cardData) => {
      res.send(cardData);
    })
    .catch((err) => {
      res.status(500).send({ message: `Произошла ошибка: ${err}` });
    });
};

module.exports = { getCards, postCard, deleteCard };