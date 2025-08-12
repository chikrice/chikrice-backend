const { z } = require('zod');

const zObjectId = z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid ObjectId');

const objectId = (value, helpers) => {
  if (!value.match(/^[0-9a-fA-F]{24}$/)) {
    return helpers.message('"{{#label}}" must be a valid mongo id');
  }
  return value;
};

const password = (value, helpers) => {
  if (value.length < 8) {
    return helpers.message('password must be at least 8 characters');
  }
  if (!value.match(/\d/) || !value.match(/[a-zA-Z]/)) {
    return helpers.message('password must contain at least 1 letter and 1 number');
  }
  return value;
};

const passwordSchema = z.string().superRefine((value, ctx) => {
  if (value.length < 8) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: 'password must be at least 8 characters',
    });
  }

  if (!value.match(/\d/) || !value.match(/[a-zA-Z]/)) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: 'password must contain at least 1 letter and 1 number',
    });
  }
});

module.exports = {
  objectId,
  zObjectId,
  password,
  passwordSchema,
};
