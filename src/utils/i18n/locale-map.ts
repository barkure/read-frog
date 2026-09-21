import type { SupportedUiLocale } from "./resources"
import type { UiLanguage } from "@/types/config/config"
import { browser } from "#imports"
import { DEFAULT_UI_LOCALE } from "./resources"

/**
 * Resolve the stored `uiLanguage` config value to a concrete supported locale.
 *
 * Explicit English/Simplified Chinese is preserved. In auto mode, Chinese
 * browser locales use Simplified Chinese; all other locales use English.
 *
 * Guarded so it degrades to "en" when `browser.i18n` is unavailable (e.g. tests).
 */
export function resolveUiLocale(uiLanguage: UiLanguage): SupportedUiLocale {
  if (uiLanguage !== "auto") {
    return uiLanguage
  }
  return resolveBrowserLocale()
}

function resolveBrowserLocale(): SupportedUiLocale {
  let uiLanguage: string
  try {
    // e.g. "en-US", "zh-CN", "ja"
    uiLanguage = browser.i18n.getUILanguage()
  } catch {
    return DEFAULT_UI_LOCALE
  }

  return uiLanguage.toLowerCase().split(/[-_]/)[0] === "zh" ? "zh-CN" : DEFAULT_UI_LOCALE
}
