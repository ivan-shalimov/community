import { ArgumentsHost, Catch, HttpException } from '@nestjs/common';
import { BaseExceptionFilter } from '@nestjs/core';

import { Response } from 'express';
import { ZodSerializationException, ZodValidationException } from 'nestjs-zod';
import * as z from 'zod';

@Catch(HttpException)
export class HttpExceptionFilter extends BaseExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    if (exception instanceof ZodSerializationException) {
      const zodError = exception.getZodError();
      if (zodError instanceof z.ZodError) {
        // todo - log this error properly
        console.error(`ZodSerializationException: ${zodError.message}`);
      }
    }

    if (exception instanceof ZodValidationException) {
      const res = host.switchToHttp().getResponse<Response>();
      const errorResponse = exception.getZodError() as z.ZodError;

      // Simplify: Map the complex array to a simple object { field: message }
      const formattedErrors = z.treeifyError(errorResponse);

      res.status(400).json({
        statusCode: 400,
        message: 'Validation failed',
        errors: formattedErrors,
      });
    }

    super.catch(exception, host);
  }
}
