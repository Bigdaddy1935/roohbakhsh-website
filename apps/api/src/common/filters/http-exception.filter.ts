import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from "@nestjs/common";
import type { Request, Response } from "express";
import type { ApiError } from "@roohbakhsh/shared";
import {
  localizeErrorCode,
  localizeValidationMessage,
  parseLocale,
} from "../i18n/error-messages";

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const req = ctx.getRequest<Request>();
    const res = ctx.getResponse<Response>();

    const locale = parseLocale(req.headers["accept-language"]);

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
        const field = msg.split(" ")[0] ?? "unknown";
        fields[field] = localizeValidationMessage(msg, locale);
      }
      const body: ApiError = {
        statusCode: status,
        code: "VALIDATION_ERROR",
        message: localizeErrorCode("VALIDATION_ERROR", locale),
        fields,
      };
      res.status(status).json(body);
      return;
    }

    const code =
      typeof raw === "string"
        ? raw
        : (raw as Record<string, unknown> | null)?.message?.toString() ??
          "INTERNAL_ERROR";

    const body: ApiError = {
      statusCode: status,
      code,
      message: localizeErrorCode(code, locale),
    };
    res.status(status).json(body);
  }
}
