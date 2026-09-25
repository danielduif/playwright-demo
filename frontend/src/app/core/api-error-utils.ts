import { HttpErrorResponse } from '@angular/common/http';

/** Extrahiert Feldfehler (field -> erste Meldung) aus einer 400-ValidationProblemDetails-Antwort. */
export function extractFieldErrors(error: HttpErrorResponse): Record<string, string> {
  const body = error.error as { errors?: Record<string, string[]> } | null;
  const errors: Record<string, string> = {};
  if (body?.errors) {
    for (const [field, messages] of Object.entries(body.errors)) {
      if (messages.length > 0) {
        errors[field] = messages[0];
      }
    }
  }
  return errors;
}

export function extractMessage(error: HttpErrorResponse): string | null {
  const body = error.error as { message?: string } | null;
  return body?.message ?? null;
}
