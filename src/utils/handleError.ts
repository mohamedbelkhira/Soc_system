import { AxiosError } from "axios";

import { getErrorMessage } from "./getErrorMessage";
import { showToast } from "./showToast";

export default function handleError(
  error: unknown,
  fallbackMessage: string,
  action?: () => void
) {
  if (error instanceof AxiosError) {
    const err = error as AxiosError;
    showToast("error", getErrorMessage(err, fallbackMessage));
  } else {
    showToast("error", fallbackMessage);
  }
  action?.();
}
