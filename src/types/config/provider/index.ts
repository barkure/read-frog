import type {
  APIProviderConfig,
  LLMProviderConfig,
  NonAPIProviderConfig,
  ProviderConfig,
  TranslateProviderConfig,
} from "./schemas"
import { isAPIProvider, isLLMProvider, isNonAPIProvider, isTranslateProvider } from "./constants"

export * from "./constants"
export * from "./schemas"

export function isTranslateProviderConfig(
  config: ProviderConfig,
): config is TranslateProviderConfig {
  return isTranslateProvider(config.provider)
}

export function isLLMProviderConfig(config: ProviderConfig): config is LLMProviderConfig {
  return isLLMProvider(config.provider)
}

export function isAPIProviderConfig(config: ProviderConfig): config is APIProviderConfig {
  return isAPIProvider(config.provider)
}

export function isNonAPIProviderConfig(config: ProviderConfig): config is NonAPIProviderConfig {
  return isNonAPIProvider(config.provider)
}
