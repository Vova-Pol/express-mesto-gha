const user = require("./models/user");

const getUsers = (req, res) => {
  res.send("Get Users Controller");
  const users = user.find();
  res.send(users);
};

const getUserById = (req, res) => {
  res.send("Get a user by Id");
};

const postUser = (req, res) => {
  res.send("Post a new User");
};

module.exports = { getUsers, postUser, getUserById };
