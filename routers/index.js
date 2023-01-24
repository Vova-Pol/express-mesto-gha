const mainRouter = require('express').Router();
const { celebrate } = require('celebrate');
const cardsRouter = require('./cards');
const usersRouter = require('./users');
const { signUpConfig, signInConfig } = require('../utils/celebrateValidConfig');
const { postUser, login } = require('../controllers/users');
const NotFoundErr = require('../errors/not-found-error');

mainRouter.post('/signup', celebrate(signUpConfig), postUser);
mainRouter.post('/signin', celebrate(signInConfig), login);

mainRouter.use('/cards', cardsRouter);
mainRouter.use('/users', usersRouter);

mainRouter.use('*', (req, res, next) => {
  next(new NotFoundErr('Такой страницы не существует'));
});

module.exports = mainRouter;
