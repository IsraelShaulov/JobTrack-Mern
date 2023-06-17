import { UnAuthenticatedError } from '../errors/index.js';
import jwt from 'jsonwebtoken';

const authenticateUser = async (req, res, next) => {
  // console.log(req.cookies);
  const token = req.cookies.token;
  if (!token) {
    throw new UnAuthenticatedError('Authentication Invalid');
  }
  // check header
  // const authHeader = req.headers.authorization;
  // if (!authHeader || !authHeader.startsWith('Bearer')) {
  //   throw new UnAuthenticatedError('Authentication Invalid');
  // }
  // const token = authHeader.split(' ')[1];
  // req.user its string
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    // console.log(payload);
    // restrict test user to access crud functionality
    const testUser = payload.userId === '647b1b60a0842c864125e2c0';
    req.user = {
      userId: payload.userId,
      testUser: testUser,
    };
    next();
  } catch (error) {
    throw new UnAuthenticatedError('Authentication Invalid');
  }
};

export default authenticateUser;
