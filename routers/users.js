const usersRouter = require('express').Router();
const { celebrate } = require('celebrate');
const {
  getUserByIdConfig,
  patchUserInfoConfig,
  patchUserAvatarConfig,
} = require('../utils/celebrateValidConfig');

const {
  getUsers,
  getUserById,
  patchUserInfo,
  patchUserAvatar,
  getCurrentUser,
} = require('../controllers/users');

usersRouter.get('/', getUsers);
usersRouter.get('/me', getCurrentUser);
usersRouter.get('/:userId', celebrate(getUserByIdConfig), getUserById);

usersRouter.patch('/me', celebrate(patchUserInfoConfig), patchUserInfo);
usersRouter.patch(
  '/me/avatar',
  celebrate(patchUserAvatarConfig),
  patchUserAvatar,
);

module.exports = usersRouter;
