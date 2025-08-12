import httpStatus from 'http-status';

import ApiError from '@/utils/ApiError';

import type { ZodTypeAny } from 'zod';
import type { NextFunction, Request, Response } from 'express';

type ZodSchema = Partial<Record<'params' | 'query' | 'body', ZodTypeAny>>;

export const zodValidate = (schema: ZodSchema) => (req: Request, _res: Response, next: NextFunction) => {
  try {
    (['params', 'query', 'body'] as const).forEach((key) => {
      const validator = schema[key];
      if (validator) {
        const result = validator.safeParse(req[key]);
        if (!result.success) {
          throw new ApiError(
            httpStatus.BAD_REQUEST,
            result.error.errors.map((err) => err.message).join(', '),
            false,
            result.error.stack,
          );
        }
      }
    });
    return next();
  } catch (error) {
    if (error instanceof ApiError) {
      return next(error);
    }
    return next(new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'Validation middleware error'));
  }
};
