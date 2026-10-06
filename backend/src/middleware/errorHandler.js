const isProduction = process.env.NODE_ENV === 'production';

export default (err, req, res, next) => {
  console.error(err);

  const status = Number(err.status) || 500;
  if (status === 404 && err.message) {
    return res.status(404).json({ success: false, error: err.message });
  }
  if (status === 400 && err.message) {
    return res.status(400).json({ success: false, error: err.message });
  }
  if (status === 403 && err.message) {
    return res.status(403).json({ success: false, error: err.message });
  }
  let message = err.message || 'Internal server error.';

  if (status >= 500 && isProduction) {
    message = 'Internal server error.';
  }

  res.status(status).json({
    success: false,
    error: message,
  });
};
