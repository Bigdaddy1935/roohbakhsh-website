import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from "@nestjs/common";
import type { Response } from "express";
import type { ApiError } from "@roohbakhsh/shared";

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const raw =
      exception instanceof HttpException ? exception.getResponse() : null;

    const code =
      typeof raw === "string"
        ? raw
        : (raw as Record<string, unknown>)?.message?.toString() ?? "INTERNAL_ERROR";

    const body: ApiError = {
      statusCode: status,
      code,
      message: code,
    };

    response.status(status).json(body);
  }
}
