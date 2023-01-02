const usersRouter = require("express").Router();

const {
  getUsers,
  postUser,
  getUserById,
  patchUserInfo,
  patchUserAvatar,
} = require("../controllers/users");

usersRouter.get("/users", getUsers);
usersRouter.get("/users/:userId", getUserById);
usersRouter.post("/users", postUser);

usersRouter.patch("/users/me", patchUserInfo);
usersRouter.patch("/users/me/avatar", patchUserAvatar);

module.exports = usersRouter;
