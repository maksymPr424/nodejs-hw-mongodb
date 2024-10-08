import bcrypt from 'bcrypt';
import { UsersCollection } from '../db/models/user.js';
import { SessionsCollection } from '../db/models/session.js';
import { randomBytes } from 'crypto';
import { FIFTEEN_MINUTES, ONE_MONTH } from '../constants/constans.js';

export const isUnicalEmale = async (email) =>
  UsersCollection.findOne({ email });

export const registerUser = async (userData) => {
  const encryptedPassword = await bcrypt.hash(userData.password, 10);

  return UsersCollection.create({ ...userData, password: encryptedPassword });
};

export const isEqualPassword = async (user, password) =>
  bcrypt.compare(password, user.password);

const createSession = () => {
  const accessToken = randomBytes(30).toString('base64');
  const refreshToken = randomBytes(30).toString('base64');

  return {
    accessToken,
    refreshToken,
    accessTokenValidUntil: new Date(Date.now() + FIFTEEN_MINUTES),
    refreshTokenValidUntil: new Date(Date.now() + ONE_MONTH),
  };
};

export const loginUser = async (user) => {
  await SessionsCollection.deleteOne({ userId: user._id });

  const newSession = createSession();

  return await SessionsCollection.create({
    userId: user._id,
    ...newSession,
  });
};

export const isEqualSession = ({ sessionId, refreshToken }) =>
  SessionsCollection.findOne({
    _id: sessionId,
    refreshToken,
  });

export const delateSession = ({ sessionId, refreshToken }) =>
  SessionsCollection.deleteOne({ _id: sessionId, refreshToken });

export const refreshUsersSession = async (userId) => {
  const newSession = createSession();

  return await SessionsCollection.create({
    userId,
    ...newSession,
  });
};
