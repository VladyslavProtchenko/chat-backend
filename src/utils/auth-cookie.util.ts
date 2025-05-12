import { Response } from 'express';

export function setAuthCookies(
  res: Response,
  tokens: { accessToken: string; refreshToken: string },
) {
  res.cookie('access_token', tokens.accessToken, {
    httpOnly: true,
    sameSite: 'none',
    secure: true,
    domain: process.env.DOMAIN_URL,
    maxAge: 15 * 60 * 1000,
    path: '/',
  });

  res.cookie('refresh_token', tokens.refreshToken, {
    httpOnly: true,
    sameSite: 'none',
    secure: true,
    domain: process.env.DOMAIN_URL,
    maxAge: 7 * 24 * 60 * 60 * 1000,
    path: '/',
  });
}
