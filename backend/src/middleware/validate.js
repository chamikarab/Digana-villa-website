export const validateRequest = (schema) => (req, res, next) => {
  const errors = [];

  Object.entries(schema).forEach(([field, checks]) => {
    const value = req.body[field];
    const validators = Array.isArray(checks) ? checks : [checks];

    validators.forEach((validator) => {
      const result = validator(value, req.body);
      if (result !== true) {
        errors.push({ field, message: result });
      }
    });
  });

  if (errors.length > 0) {
    return res.status(400).json({ success: false, errors });
  }

  return next();
};
