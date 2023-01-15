const { Joi } = require('celebrate');

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
    avatar: Joi.string().pattern(/^https?:\/\/[^а-яё\s]+$/),
  }),
};

const getUserByIdConfig = {
  params: Joi.object().keys({
    userId: Joi.string().alphanum().length(24),
  }),
};

const patchUserInfoConfig = {
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
  }),
};

const patchUserAvatarConfig = {
  body: Joi.object().keys({
    avatar: Joi.string().pattern(/^https?:\/\/[^а-яё\s]+$/),
  }),
};

// --- Cards Config

const postCardConfig = {
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    link: Joi.string()
      .required()
      .pattern(/^https?:\/\/[^а-яё\s]+$/),
  }),
};

const deleteCardConfig = {
  params: Joi.object().keys({
    cardId: Joi.string().alphanum().length(24),
  }),
};

const putLikeConfig = {
  params: Joi.object().keys({
    cardId: Joi.string().alphanum().length(24),
  }),
};

const deleteLikeConfig = {
  params: Joi.object().keys({
    cardId: Joi.string().alphanum().length(24),
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
