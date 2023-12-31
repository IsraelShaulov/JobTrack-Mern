import User from '../models/User.js';
import { StatusCodes } from 'http-status-codes';
import { BadRequestError, UnAuthenticatedError } from '../errors/index.js';
import attachCookies from '../utils/attachCookies.js';

const register = async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    throw new BadRequestError('please provide all values');
  }
  const emailAlreadyExists = await User.findOne({ email });
  if (emailAlreadyExists) {
    throw new BadRequestError('Email already in use');
  }

  const user = await User.create({ name, email, password });
  const token = user.createJWT();

  // cookies
  attachCookies({ res, token });

  res.status(StatusCodes.CREATED).json({
    user: {
      email: user.email,
      lastName: user.lastName,
      location: user.location,
      name: user.name,
    },
    // token,
    location: user.location,
  });
};

const login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    throw new BadRequestError('Please provide all values');
  }

  const user = await User.findOne({ email }).select('+password');

  // user not exists
  if (!user) {
    throw new UnAuthenticatedError('This email are not exists');
  }

  // user exists
  const isPasswordCorrect = await user.comparePassword(password);
  if (!isPasswordCorrect) {
    throw new UnAuthenticatedError('Wrong password');
  }
  const token = user.createJWT();
  user.password = undefined;

  // cookies
  attachCookies({ res, token });

  // res.status(StatusCodes.OK).json({ user, token, location: user.location });
  res.status(StatusCodes.OK).json({ user, location: user.location });
};

const updateUser = async (req, res) => {
  // console.log(req.user);
  const { email, name, lastName, location } = req.body;
  if (!email || !name || !lastName || !location) {
    throw new BadRequestError('Please provide all values');
  }

  // const user = await User.findOne({ _id: req.user.userId });
  const user = await User.findByIdAndUpdate(
    { _id: req.user.userId },
    { email, name, lastName, location },
    { new: true }
  );

  // user.email = email;
  // user.name = name;
  // user.lastName = lastName;
  // user.location = location;

  // await user.save();

  const token = user.createJWT();

  // cookies
  attachCookies({ res, token });

  // res.status(StatusCodes.OK).json({ user, token, location: user.location });
  res.status(StatusCodes.OK).json({ user, location: user.location });
};

const getCurrentUser = async (req, res) => {
  const user = await User.findOne({ _id: req.user.userId });
  res.status(StatusCodes.OK).json({ user, location: user.location });
};

// delete cookie from the browser
const logout = async (req, res) => {
  res.cookie('token', 'logout', {
    httpOnly: true,
    expires: new Date(Date.now()),
  });
  res.status(StatusCodes.OK).json({ msg: 'user logged out!' });
};

export { register, login, updateUser, getCurrentUser, logout };
