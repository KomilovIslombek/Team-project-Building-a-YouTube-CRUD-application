export const validate = (schema) => (req, res, next) => {
  const { error, value } = schema.validate(req.body, {
    abortEarly: false,   // collect all errors, not just the first
    stripUnknown: true,  // drop fields not in the schema
  });

  if (error) {
    return res.status(400).json({
      status: 400,
      message: "Validation error",
      errors: error.details.map((d) => ({ field: d.path[0], message: d.message })),
    });
  }

  req.body = value; // cleaned (trimmed) values
  next();
};