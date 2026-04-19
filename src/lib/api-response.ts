import { NextResponse } from "next/server";
import { ZodError } from "zod";

type ApiSuccess<T> = { success: true; data: T };
type ApiError = { success: false; error: { code: string; message: string; fields?: Record<string, string> } };

export function ok<T>(data: T, status = 200): NextResponse<ApiSuccess<T>> {
  return NextResponse.json({ success: true, data }, { status });
}

export function err(code: string, message: string, status: number, fields?: Record<string, string>): NextResponse<ApiError> {
  return NextResponse.json({ success: false, error: { code, message, ...(fields && { fields }) } }, { status });
}

export function fromZodError(error: ZodError): NextResponse<ApiError> {
  const fields: Record<string, string> = {};
  error.issues.forEach((issue) => {
    fields[issue.path.join(".")] = issue.message;
  });
  return err("VALIDATION_ERROR", "Dados inválidos", 422, fields);
}
