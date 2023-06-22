const User = require("../models/User");

const createUser = async (
  firstName,
  lastName,
  email,
  password,
  jobTtitle,
  bio,
  avatar
) => {
  const date = new Date();
  const formattedDate = date.toLocaleString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
  });

  const newUser = new User({
    account: {
      firstName: firstName,
      lastName: lastName,
      email: email,
      password: password,
      role: "Subscriber",
      dateRegistered: formattedDate,
    },
    profile: {
      jobTitle: jobTtitle,
      bio: bio,
      avatar: avatar,
    },
  });
  await newUser.save();
  return {
    _id: newUser._id,
    account: {
      firstName: newUser.account.firstName,
      lastName: newUser.account.lastName,
      email: newUser.account.email,
      role: newUser.account.role,
      dateRegistered: newUser.account.dateRegistered,
    },
    profile: {
      jobTitle: newUser.profile.jobTitle,
      bio: newUser.profile.bio,
      avatar: newUser.profile.avatar,
    },
  };
};

const readAllUsers = async () => {
  const allUsers = await User.find({}, "-account.password");
  return allUsers;
};

const readUser = async (id) => {
  const userDetail = await User.findById({ _id: id }, "-account.password");
  if (userDetail === null) {
    return null;
  }
  return userDetail;
};

const updateName = async (id, newFirstName, newLastName) => {
  const user = await User.findById(id);
  user.account.firstName = newFirstName;
  user.account.lastName = newLastName;
  await user.save();
  return {
    _id: user._id,
    account: {
      firstName: user.account.firstName,
      lastName: user.account.lastName,
      email: user.account.email,
      role: user.account.role,
      dateRegistered: user.account.dateRegistered,
    },
    profile: {
      jobTitle: user.profile.jobTitle,
      bio: user.profile.bio,
      avatar: user.profile.avatar,
    },
  };
};

const updateEmail = async (id, newEmail) => {
  const user = await User.findById(id);
  user.account.email = newEmail;
  await user.save();
  return {
    _id: user._id,
    account: {
      firstName: user.account.firstName,
      lastName: user.account.lastName,
      email: user.account.email,
      role: user.account.role,
      dateRegistered: user.account.dateRegistered,
    },
    profile: {
      jobTitle: user.profile.jobTitle,
      bio: user.profile.bio,
      avatar: user.profile.avatar,
    },
  };
};

const updateRole = async (id, newRole) => {
  const user = await User.findById(id);
  user.account.role = newRole;
  await user.save();
  return {
    _id: user._id,
    account: {
      firstName: user.account.firstName,
      lastName: user.account.lastName,
      email: user.account.email,
      role: user.account.role,
      dateRegistered: user.account.dateRegistered,
    },
    profile: {
      jobTitle: user.profile.jobTitle,
      bio: user.profile.bio,
      avatar: user.profile.avatar,
    },
  };
};

const updatePassword = async (id, newPassword) => {
  const user = await User.findById(id);
  user.account.password = newPassword;
  await user.save();
  return {
    _id: user._id,
    account: {
      firstName: user.account.firstName,
      lastName: user.account.lastName,
      email: user.account.email,
      role: user.account.role,
      dateRegistered: user.account.dateRegistered,
    },
    profile: {
      jobTitle: user.profile.jobTitle,
      bio: user.profile.bio,
      avatar: user.profile.avatar,
    },
  };
};

const updateProfile = async (id, newJobTitle, newBio) => {
  const user = await User.findById(id);
  user.profile.jobTitle = newJobTitle;
  user.profile.bio = newBio;
  await user.save();
  return {
    _id: user._id,
    account: {
      firstName: user.account.firstName,
      lastName: user.account.lastName,
      email: user.account.email,
      role: user.account.role,
      dateRegistered: user.account.dateRegistered,
    },
    profile: {
      jobTitle: user.profile.jobTitle,
      bio: user.profile.bio,
      avatar: user.profile.avatar,
    },
  };
};

const updateAvatar = async (id, newAvatar) => {
  const user = await User.findById(id);
  user.profile.avatar = newAvatar;
  await user.save();
  return {
    _id: user._id,
    account: {
      firstName: user.account.firstName,
      lastName: user.account.lastName,
      email: user.account.email,
      role: user.account.role,
      dateRegistered: user.account.dateRegistered,
    },
    profile: {
      jobTitle: user.profile.jobTitle,
      bio: user.profile.bio,
      avatar: user.profile.avatar,
    },
  };
};

const deleteUsers = async (usersId) => {
  const deletedCount = await User.deleteMany({ _id: { $in: usersId } });
  if (deletedCount) {
    return deletedCount;
  }
};

module.exports = {
  createUser,
  readAllUsers,
  readUser,
  updateName,
  updateEmail,
  updateRole,
  updatePassword,
  updateProfile,
  updateAvatar,
  deleteUsers,
};
