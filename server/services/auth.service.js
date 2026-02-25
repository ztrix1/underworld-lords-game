const User = require("../models/User");

const registerUser = async ({ username, email, password }) => {
  const existing = await User.findOne({
    $or: [{ email }, { username }],
  });

  if (existing) {
    throw new Error("User already exists");
  }

  const user = await User.create({
    username,
    email,
    password,
  });

  return user;
};

module.exports = {
  registerUser,
};
