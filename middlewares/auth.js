const jwt = require('jsonwebtoken');

const unauthorizedErrCode = 401;

module.exports = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    return res
      .status(unauthorizedErrCode)
      .send({ message: 'Необходима авторизация' });
  }

  const token = authorization.replace('Bearer ', '');
  let payload;

  try {
    payload = jwt.verify(token, 'secret-key');
  } catch (err) {
    return res
      .status(unauthorizedErrCode)
      .send({ message: 'Необходима авторизация' });
  }

  req.user = payload;

  next();
};
