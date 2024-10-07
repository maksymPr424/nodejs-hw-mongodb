import { ONE_MONTH } from '../constants/constans.js';
import {
  isUnicalEmale,
  loginUser,
  registerUser,
  isEqualPassword,
  refreshUsersSession,
  isEqualSession,
  delateSession,
} from '../services/auth.js';
import createHttpError from 'http-errors';

export const registerUserController = async (req, res) => {
  const { email } = req.body;
  const takenEmail = await isUnicalEmale(email);
  if (takenEmail) throw createHttpError(409, 'Email in use');

  const user = await registerUser(req.body);

  res.status(201).json({
    status: 201,
    message: 'Successfully registered a user!',
    data: user,
  });
};

export const loginUserController = async (req, res) => {
  const { password, email } = req.body;

  const user = await isUnicalEmale(email);
  if (!user) throw createHttpError(409, 'Email no use');

  const isEqual = await isEqualPassword(user, password);
  if (!isEqual) throw createHttpError(401, 'Unauthorized');

  const session = await loginUser(user);

  res.cookie('refreshToken', session.refreshToken, {
    httpOnly: true,
    expires: new Date(Date.now() + ONE_MONTH),
  });

  res.cookie('sessionId', session._id, {
    httpOnly: true,
    expires: new Date(Date.now() + ONE_MONTH),
  });

  res.json({
    status: 200,
    message: 'Successfully logged in an user!',
    data: {
      accessToken: session.accessToken,
    },
  });
};

const setupSession = (res, session) => {
  res.cookie('refreshToken', session.refreshToken, {
    httpOnly: true,
    expires: new Date(Date.now() + ONE_MONTH),
  });
  res.cookie('sessionId', session._id, {
    httpOnly: true,
    expires: new Date(Date.now() + ONE_MONTH),
  });
};

export const refreshUserController = async (req, res) => {
  const session = isEqualSession({
    sessionId: req.cookies.sessionId,
    refreshToken: req.cookies.refreshToken,
  });

  if (!session) throw createHttpError(401, 'Session not found');

  const isSessionTokenExpired =
    new Date() > new Date(session.refreshTokenValidUntil);

  if (isSessionTokenExpired) {
    throw createHttpError(401, 'Session token expired');
  }

  await delateSession({
    sessionId: req.cookies.sessionId,
    refreshToken: req.cookies.refreshToken,
  });

  const refreshedSession = await refreshUsersSession({
    sessionId: req.cookies.sessionId,
    refreshToken: req.cookies.refreshToken,
  });

  setupSession(res, refreshedSession);

  res.json({
    status: 200,
    message: 'Successfully refreshed a session!',
    data: {
      accessToken: refreshedSession.accessToken,
    },
  });
};

export const logoutUserController = async (req, res) => {
  const { sessionId, refreshToken } = req.cookies;
  if (sessionId) await delateSession({ sessionId, refreshToken });

  res.clearCookie('sessionId');
  res.clearCookie('refreshToken');

  res.sendStatus(204);
};
