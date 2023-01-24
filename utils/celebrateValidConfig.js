const { Joi } = require('celebrate');
const { urlRegex } = require('./constants');

// --- Users Config

const signInConfig = {
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(8),
  }),
};

const signUpConfig = {
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(8),
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    avatar: Joi.string().pattern(urlRegex),
  }),
};

const getUserByIdConfig = {
  params: Joi.object().keys({
    userId: Joi.string().hex().length(24),
  }),
};

const patchUserInfoConfig = {
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    about: Joi.string().required().min(2).max(30),
  }),
};

const patchUserAvatarConfig = {
  body: Joi.object().keys({
    avatar: Joi.string().required().pattern(urlRegex),
  }),
};

// --- Cards Config

const postCardConfig = {
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    link: Joi.string().required().pattern(urlRegex),
  }),
};

const deleteCardConfig = {
  params: Joi.object().keys({
    cardId: Joi.string().required().hex().length(24),
  }),
};

const putLikeConfig = {
  params: Joi.object().keys({
    cardId: Joi.string().required().hex().length(24),
  }),
};

const deleteLikeConfig = {
  params: Joi.object().keys({
    cardId: Joi.string().required().hex().length(24),
  }),
};

module.exports = {
  signInConfig,
  signUpConfig,
  getUserByIdConfig,
  patchUserInfoConfig,
  patchUserAvatarConfig,
  postCardConfig,
  deleteCardConfig,
  putLikeConfig,
  deleteLikeConfig,
};
