import {
  LLM_PROVIDER_MODELS,
  NON_API_TRANSLATE_PROVIDERS,
  NON_API_TRANSLATE_PROVIDERS_MAP,
} from "@/utils/constants/models"

// Re-export for external consumers.
export { LLM_PROVIDER_MODELS, NON_API_TRANSLATE_PROVIDERS, NON_API_TRANSLATE_PROVIDERS_MAP }

/* ──────────────────────────────
  Provider types
  ────────────────────────────── */

/** The fixed catalog available to translation features and provider pickers. */
export const TRANSLATE_PROVIDER_TYPES = [
  "google-translate",
  "microsoft-translate",
  "deepseek",
] as const satisfies Readonly<
  (keyof typeof LLM_PROVIDER_MODELS | (typeof NON_API_TRANSLATE_PROVIDERS)[number])[]
>
export type TranslateProviderTypes = (typeof TRANSLATE_PROVIDER_TYPES)[number]
export function isTranslateProvider(provider: string): provider is TranslateProviderTypes {
  return TRANSLATE_PROVIDER_TYPES.includes(provider)
}

/** The language-model providers, i.e. the ones that need a key and run prompts. */
export const LLM_PROVIDER_TYPES = ["deepseek"] as const satisfies Readonly<
  (keyof typeof LLM_PROVIDER_MODELS)[]
>
export type LLMProviderTypes = (typeof LLM_PROVIDER_TYPES)[number]
export function isLLMProvider(provider: string): provider is LLMProviderTypes {
  return LLM_PROVIDER_TYPES.includes(provider)
}

/** The providers that carry a key, a model and the rest of the API config: the LLM ones. */
export const API_PROVIDER_TYPES = ["deepseek"] as const satisfies Readonly<LLMProviderTypes[]>
export type APIProviderTypes = (typeof API_PROVIDER_TYPES)[number]
export function isAPIProvider(provider: string): provider is APIProviderTypes {
  return API_PROVIDER_TYPES.includes(provider)
}

export type NonAPIProviderTypes = (typeof NON_API_TRANSLATE_PROVIDERS)[number]
export function isNonAPIProvider(provider: string): provider is NonAPIProviderTypes {
  return NON_API_TRANSLATE_PROVIDERS.includes(provider)
}

export const ALL_PROVIDER_TYPES = [
  "google-translate",
  "microsoft-translate",
  "deepseek",
] as const satisfies Readonly<TranslateProviderTypes[]>
export type AllProviderTypes = (typeof ALL_PROVIDER_TYPES)[number]
