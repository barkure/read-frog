import { isExtensionContextInvalidatedError } from "@/utils/error/extension-context"
import { extractAISDKErrorMessage } from "@/utils/error/extract-message"
import { i18n } from "@/utils/i18n"

export interface SelectionToolbarInlineError {
  title: string
  description: string
}

type SelectionToolbarPrecheckErrorCode =
  | "actionUnavailable"
  | "missingSelection"
  | "providerDisabled"
  | "providerUnavailable"

const UNEXPECTED_ERROR_MESSAGE = "Unexpected error occurred"

export function isAbortError(error: unknown) {
  return error instanceof DOMException && error.name === "AbortError"
}

function getPrecheckErrorDescription(code: SelectionToolbarPrecheckErrorCode) {
  return i18n.t(`options.selectionToolbar.errors.${code}` as never)
}

function toErrorDescription(error: unknown) {
  // Raw "Extension context invalidated." tells the user nothing actionable, and
  // the popover's retry button can never recover from it — only a reload can.
  if (isExtensionContextInvalidatedError(error)) {
    return i18n.t("translation.extensionContextInvalidated")
  }

  const message = extractAISDKErrorMessage(error)
  if (!message || message === UNEXPECTED_ERROR_MESSAGE) {
    return i18n.t("translation.failedFallback")
  }

  return message
}

export function createSelectionToolbarPrecheckError(
  code: SelectionToolbarPrecheckErrorCode,
): SelectionToolbarInlineError {
  return {
    title: i18n.t("translation.failed"),
    description: getPrecheckErrorDescription(code),
  }
}

export function createSelectionToolbarRuntimeError(error: unknown): SelectionToolbarInlineError {
  return {
    title: i18n.t("translation.failed"),
    description: toErrorDescription(error),
  }
}
