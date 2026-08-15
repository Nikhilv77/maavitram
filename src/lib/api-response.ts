import { NextResponse } from "next/server";

export interface ApiErrorBody {
  error: {
    message: string;
    issues?: Record<string, string[] | undefined>;
  };
}

/** The one error shape every API route returns — `{ error: { message, issues? } }`. */
export function apiError(
  message: string,
  status: number,
  issues?: Record<string, string[] | undefined>,
): NextResponse<ApiErrorBody> {
  return NextResponse.json({ error: { message, issues } }, { status });
}
