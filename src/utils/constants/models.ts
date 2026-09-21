/**
 * The model each LLM provider offers in its dropdown.
 *
 * Reviewed against the DeepSeek API docs on 2026-09-11: `deepseek-flash` is
 * DeepSeek-V4.1-Flash and `deepseek-v4-pro` is DeepSeek-V4-Pro-0813. The retired names
 * (`deepseek-v4-flash`, `deepseek-v4-flash-vision-exp`, `deepseek-chat`, `deepseek-reasoner`) are
 * deliberately not listed — DeepSeek serves them from other models or has stopped serving them —
 * but a config still holding one keeps parsing, because deepseek's model field is a plain string.
 */
export const LLM_PROVIDER_MODELS = {
  deepseek: ["deepseek-flash", "deepseek-v4-pro"],
} as const

/** Providers that translate without an API key, through an endpoint that needs no configuration. */
export const NON_API_TRANSLATE_PROVIDERS = ["google-translate", "microsoft-translate"] as const
export const NON_API_TRANSLATE_PROVIDERS_MAP: Record<
  (typeof NON_API_TRANSLATE_PROVIDERS)[number],
  string
> = {
  "google-translate": "Google Translate",
  "microsoft-translate": "Microsoft Translator",
}
