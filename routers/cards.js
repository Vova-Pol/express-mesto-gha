const cardsRouter = require('express').Router();
const { celebrate } = require('celebrate');
const {
  postCardConfig,
  deleteCardConfig,
  putLikeConfig,
  deleteLikeConfig,
} = require('../utils/celebrateValidConfig');

const {
  getCards,
  postCard,
  deleteCard,
  putLike,
  deleteLike,
} = require('../controllers/cards');

cardsRouter.get('/', getCards);
cardsRouter.post('/', celebrate(postCardConfig), postCard);
cardsRouter.delete('/:cardId', celebrate(deleteCardConfig), deleteCard);

cardsRouter.put('/:cardId/likes', celebrate(putLikeConfig), putLike);
cardsRouter.delete('/:cardId/likes', celebrate(deleteLikeConfig), deleteLike);

module.exports = cardsRouter;
