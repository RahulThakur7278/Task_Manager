import jwt from 'jsonwebtoken';

export const generateAccessToken = (userId, role, tokenVersion) => {
  return jwt.sign({ id: userId, role, tokenVersion }, process.env.JWT_ACCESS_SECRET, {
    expiresIn: '15m',
  });
};

export const generateRefreshToken = (userId, role, tokenVersion) => {
  return jwt.sign({ id: userId, role, tokenVersion }, process.env.JWT_REFRESH_SECRET, {
    expiresIn: '7d',
  });
};
