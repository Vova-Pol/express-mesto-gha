const router = require("express").Router();

router.get("/", (req, res) => {
  res.send("Main Page");
});

// --- Users Router
const {
  getUsers,
  postUser,
  getUserById,
  patchUserInfo,
  patchUserAvatar,
} = require("./controllers/users");

router.get("/users", getUsers);
router.get("/users/:userId", getUserById);
router.post("/users", postUser);

router.patch("/users/me", patchUserInfo);
router.patch("/users/me/avatar", patchUserAvatar);

// --- Cards Router

const {
  getCards,
  postCard,
  deleteCard,
  putLike,
  deleteLike,
} = require("./controllers/cards");

router.get("/cards", getCards);
router.post("/cards", postCard);
router.delete("/cards/:cardId", deleteCard);

router.put("/cards/:cardId/likes", putLike);
router.delete("/cards/:cardId/likes", deleteLike);

module.exports = router;
