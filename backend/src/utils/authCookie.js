const COOKIE_NAME = 'digana_token';

export function getTokenFromRequest(req) {
  if (req.cookies?.[COOKIE_NAME]) {
    return req.cookies[COOKIE_NAME];
  }
  const authHeader = req.headers.authorization;
  if (authHeader?.startsWith('Bearer ')) {
    return authHeader.split(' ')[1];
  }
  return null;
}

export function setAuthCookie(res, token, remember) {
  const isProduction = process.env.NODE_ENV === 'production';
  const options = {
    httpOnly: true,
    secure: isProduction,
    sameSite: 'lax',
    path: '/',
  };
  if (remember) {
    options.maxAge = 8 * 60 * 60 * 1000;
  }
  res.cookie(COOKIE_NAME, token, options);
}

export function clearAuthCookie(res) {
  const isProduction = process.env.NODE_ENV === 'production';
  res.clearCookie(COOKIE_NAME, {
    httpOnly: true,
    secure: isProduction,
    sameSite: 'lax',
    path: '/',
  });
}
