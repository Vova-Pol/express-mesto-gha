const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const usersRouter = require('./routers/users');
const cardsRouter = require('./routers/cards');
const { postUser, login } = require('./controllers/users');
const auth = require('./middlewares/auth');

const { PORT = 3000 } = process.env;
const DB_URL = 'mongodb://localhost:27017/mestodb';

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use((req, res, next) => {
  req.user = {
    _id: '63a86aec35e239f3ab163d09',
  };

  next();
});

app.post('/signin', login);
app.post('/signup', postUser);

// app.use(auth);
app.use('/', usersRouter);
app.use('/', cardsRouter);

app.use('*', (req, res) => {
  res.status(404).send({ message: 'Такой страницы не существует' });
});

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
