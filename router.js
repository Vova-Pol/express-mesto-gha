const router = require("express").Router();

router.get("/", (req, res) => {
  res.send("Main Page");
});

// --- Users Router
const {
  getUsers,
  postUser,
  getUserById,
} = require("./controllers/controllers-users");

router.get("/users", getUsers);
router.get("/users/:userId", getUserById);
router.post("/users", postUser);

// --- Cards Router

const {
  getCards,
  postCard,
  deleteCard,
} = require("./controllers/controllers-cards");

router.get("/cards", getCards);
router.post("/cards", postCard);
router.delete("/cards/:cardId", deleteCard);

module.exports = router;
