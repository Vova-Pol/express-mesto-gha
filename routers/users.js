const usersRouter = require('express').Router();

const {
  getUsers,
  getUserById,
  patchUserInfo,
  patchUserAvatar,
} = require('../controllers/users');

usersRouter.get('/users', getUsers);
usersRouter.get('/users/:userId', getUserById);

usersRouter.patch('/users/me', patchUserInfo);
usersRouter.patch('/users/me/avatar', patchUserAvatar);

module.exports = usersRouter;
