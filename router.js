const router = require("express").Router();
const { getUsers, postUser, getUserById } = require("./controllers");

router.get("/", (req, res) => {
  res.send("Hello, main page");
});

router.get("/users", getUsers);
router.get("/users/:userId", getUserById);
router.post("/users", postUser);

module.exports = router;
