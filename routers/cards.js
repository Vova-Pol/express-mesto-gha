const cardsRouter = require("express").Router();

const {
  getCards,
  postCard,
  deleteCard,
  putLike,
  deleteLike,
} = require("../controllers/cards");

cardsRouter.get("/cards", getCards);
cardsRouter.post("/cards", postCard);
cardsRouter.delete("/cards/:cardId", deleteCard);

cardsRouter.put("/cards/:cardId/likes", putLike);
cardsRouter.delete("/cards/:cardId/likes", deleteLike);

module.exports = cardsRouter;
