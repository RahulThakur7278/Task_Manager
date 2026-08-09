import AppError from '../utils/AppError.js';

/**
 * Zod validation middleware factory.
 * @param {import('zod').ZodSchema} schema - Zod schema to validate req.body against
 */
const validate = (schema) => (req, res, next) => {
  const result = schema.safeParse(req.body);

  if (!result.success) {
    const messages = result.error.errors.map((e) => e.message).join(', ');
    return next(new AppError(messages, 400));
  }

  req.body = result.data;
  next();
};

export default validate;
