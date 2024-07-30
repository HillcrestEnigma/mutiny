import { MutinyServerError } from "@repo/error";
import type { ErrorType } from "@repo/schema";
import type { UseFormSetError, FieldValues } from "react-hook-form";

export function formatMutinyServerError(
  error: MutinyServerError,
  messages?: Partial<Record<ErrorType, string>>,
): string {
  return messages?.[error.errorType] ?? error.message;
}

export function handleMutationError<FormInputs extends FieldValues>(
  setError: UseFormSetError<FormInputs>,
  messages?: Partial<Record<ErrorType, string>>,
) {
  return (error: Error) => {
    if (error instanceof MutinyServerError) {
      setError("root", {
        message: formatMutinyServerError(error, messages ?? {}),
      });
    }
  };
}
