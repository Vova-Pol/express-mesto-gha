const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const { errors, celebrate } = require('celebrate');
const { postUser, login } = require('./controllers/users');
const auth = require('./middlewares/auth');
const centralErrorHandling = require('./middlewares/centralErrorHandling');
const NotFoundErr = require('./errors/not-found-error');
const { signInConfig, signUpConfig } = require('./utils/celebrateValidConfig');
const mainRouter = require('./routers');

const { PORT = 3000 } = process.env;
const DB_URL = 'mongodb://localhost:27017/mestodb';

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.post('/signup', celebrate(signUpConfig), postUser);
app.post('/signin', celebrate(signInConfig), login);

app.use(auth);
app.use('/', mainRouter);

app.use('*', () => {
  throw new NotFoundErr('Такой страницы не существует');
});

// --- Обработка ошибок

app.use(errors());
app.use(centralErrorHandling);

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
