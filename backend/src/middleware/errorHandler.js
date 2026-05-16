const isProduction = process.env.NODE_ENV === 'production';

export default (err, req, res, next) => {
  console.error(err);

  const status = Number(err.status) || 500;
  let message = err.message || 'Internal server error.';

  if (status >= 500 && isProduction) {
    message = 'Internal server error.';
  }

  res.status(status).json({
    success: false,
    error: message,
  });
};
