const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const { errors, celebrate } = require('celebrate');
const usersRouter = require('./routers/users');
const cardsRouter = require('./routers/cards');
const { postUser, login } = require('./controllers/users');
const auth = require('./middlewares/auth');
const NotFoundErr = require('./errors/not-found-error');
const { signInConfig, signUpConfig } = require('./utils/celebrateValidConfig');

const { PORT = 3000 } = process.env;
const DB_URL = 'mongodb://localhost:27017/mestodb';

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.post('/signup', celebrate(signUpConfig), postUser);
app.post('/signin', celebrate(signInConfig), login);

app.use(auth);
app.use('/users', usersRouter);
app.use('/cards', cardsRouter);

app.use('*', () => {
  throw new NotFoundErr('Такой страницы не существует');
});

// --- Обработка ошибок

app.use(errors());

app.use((err, req, res, next) => {
  const { statusCode = 500, message } = err;

  res.status(statusCode).send({
    message: statusCode === 500 ? 'Ошибка на сервере' : message,
  });
  next();
});

// --- Запуск сервера

async function startApp() {
  try {
    await mongoose.connect(DB_URL, {
      useNewUrlParser: true,
    });

    app.listen(PORT, () => {
      console.log(`App is working on PORT ${PORT}`);
    });
  } catch (err) {
    console.log(`Произошла ошибка при запуске приложения: ${err}`);
  }
}

startApp();
