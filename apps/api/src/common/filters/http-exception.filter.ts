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
      exception instanceof HttpException
        ? (exception.getResponse() as string | Record<string, unknown>)
        : null;

    // NestJS ValidationPipe: { statusCode, message: string[], error: "Bad Request" }
    if (
      typeof raw === "object" &&
      raw !== null &&
      Array.isArray(raw["message"])
    ) {
      const messages = raw["message"] as string[];
      const fields: Record<string, string> = {};
      for (const msg of messages) {
        // "fieldName must be ..." — extract field from first word
        const field = msg.split(" ")[0] ?? "unknown";
        fields[field] = msg;
      }
      const body: ApiError = {
        statusCode: status,
        code: "VALIDATION_ERROR",
        message: "Validation failed",
        fields,
      };
      response.status(status).json(body);
      return;
    }

    const code =
      typeof raw === "string"
        ? raw
        : (raw as Record<string, unknown> | null)?.message?.toString() ??
          "INTERNAL_ERROR";

    const body: ApiError = { statusCode: status, code, message: code };
    response.status(status).json(body);
  }
}
