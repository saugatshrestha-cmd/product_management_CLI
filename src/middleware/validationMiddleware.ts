import { Request, Response, NextFunction, RequestHandler } from 'express';
import { ObjectSchema } from 'joi';

export class Validator {
  private schema: ObjectSchema;

  constructor(schema: ObjectSchema) {
    this.schema = schema;
  }

  validate(): RequestHandler {
    return (req: Request, res: Response, next: NextFunction): void => {
      const { error } = this.schema.validate(req.body, { abortEarly: false });

      if (error) {
        res.status(400).json({
          message: 'Validation error',
          details: error.details.map((detail) => detail.message),
        });
        return;
      }

      next();
    };
  }
}
