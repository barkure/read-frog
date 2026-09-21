import type { Config } from "@/types/config/config"
import type { LanguageDetectionMode } from "@/types/config/language-detection"
import type {
  APIProviderConfig,
  LLMProviderConfig,
  NonAPIProviderConfig,
  ProviderConfig,
  ProvidersConfig,
  TranslateProviderConfig,
} from "@/types/config/provider"
import type { FeatureKey } from "@/utils/constants/feature-providers"
import {
  isAPIProviderConfig,
  isLLMProviderConfig,
  isNonAPIProviderConfig,
  isTranslateProviderConfig,
} from "@/types/config/provider"
import { FEATURE_KEYS, FEATURE_PROVIDER_DEFS } from "@/utils/constants/feature-providers"
import { getUsableProviderIdsForCapability } from "@/utils/providers/provider-availability"

export function getProviderConfigById<T extends ProviderConfig>(
  providersConfig: T[],
  providerId: string,
): T | undefined {
  return providersConfig.find((p) => p.id === providerId)
}

export function getLLMProvidersConfig(providersConfig: ProvidersConfig): LLMProviderConfig[] {
  return providersConfig.filter(isLLMProviderConfig)
}

export function getAPIProvidersConfig(providersConfig: ProvidersConfig): APIProviderConfig[] {
  return providersConfig.filter(isAPIProviderConfig)
}

export function getNonAPIProvidersConfig(providersConfig: ProvidersConfig): NonAPIProviderConfig[] {
  return providersConfig.filter(isNonAPIProviderConfig)
}

export function getTranslateProvidersConfig(
  providersConfig: ProvidersConfig,
): TranslateProviderConfig[] {
  return providersConfig.filter(isTranslateProviderConfig)
}

export function filterEnabledProvidersConfig(providersConfig: ProvidersConfig): ProvidersConfig {
  return providersConfig.filter((p) => p.enabled)
}

export function getEnabledLLMProvidersConfig(
  providersConfig: ProvidersConfig,
): LLMProviderConfig[] {
  return filterEnabledProvidersConfig(providersConfig).filter(isLLMProviderConfig)
}

export function getProviderKeyByName(
  providersConfig: ProvidersConfig,
  providerId: string,
): string | undefined {
  const provider = getProviderConfigById(providersConfig, providerId)
  return provider?.provider
}

export function getProviderModelConfig(config: Config, providerId: string) {
  const providerConfig = getProviderConfigById(config.providersConfig, providerId)
  if (providerConfig && isLLMProviderConfig(providerConfig)) {
    return providerConfig.model
  }
  return undefined
}

export function getProviderApiKey(
  providersConfig: ProvidersConfig,
  providerId: string,
): string | undefined {
  const providerConfig = getProviderConfigById(providersConfig, providerId)
  if (providerConfig && isAPIProviderConfig(providerConfig)) {
    return providerConfig.apiKey
  }
  return undefined
}

export function resolveLanguageDetectionConfigForModeChange(
  currentConfig: Config["languageDetection"],
  nextMode: LanguageDetectionMode,
  providersConfig: ProvidersConfig,
): Partial<Config["languageDetection"]> | null {
  if (nextMode === "basic") {
    return { mode: "basic" }
  }

  // Capability-based, not providersConfig-based: only enabled LLM providers
  // qualify, so "no LLM available" is reported before arming LLM mode against a
  // provider that cannot detect.
  const availableIds = getUsableProviderIdsForCapability("languageDetection", providersConfig)
  if (availableIds.length === 0) {
    return null
  }

  const hasSelectedProvider =
    currentConfig.providerId !== undefined && availableIds.includes(currentConfig.providerId)
  return {
    mode: "llm",
    providerId: hasSelectedProvider ? currentConfig.providerId : availableIds[0]!,
  }
}

/**
 * Compute fallback provider assignments when a provider is deleted.
 * For each feature using the deleted provider, picks the first remaining
 * provider that can actually run it — reassigning to one that cannot is what
 * turns a delete into a silently broken feature.
 */
export function computeProviderFallbacksAfterDeletion(
  deletedProviderId: string,
  config: Config,
  remainingProviders: ProvidersConfig,
): Partial<Record<FeatureKey, string>> {
  const updates: Partial<Record<FeatureKey, string>> = {}
  for (const key of FEATURE_KEYS) {
    const def = FEATURE_PROVIDER_DEFS[key]
    const currentId = def.getProviderId(config)
    if (currentId !== deletedProviderId) continue
    const fallbackProviderId = getUsableProviderIdsForCapability(key, remainingProviders)[0]
    if (fallbackProviderId) updates[key] = fallbackProviderId
  }
  return updates
}

/**
 * The first feature that would be left with no provider that can actually run
 * it, or null when every feature keeps a working one.
 *
 * Gated on usable providers, not merely present ones: a user can delete their
 * last provider and half the extension would otherwise be reassigned to a slot
 * that no longer resolves.
 *
 * Features the user has switched off count too. Their `providerId` is stored
 * either way, and `computeProviderFallbacksAfterDeletion` can only reassign it
 * when a replacement exists — so letting the delete through leaves the slot
 * pointing at a provider that no longer exists at all, which resolves to null
 * the moment the feature is switched back on.
 */
export function findFeatureMissingProvider(
  remainingProviders: ProvidersConfig,
  config?: Config,
): FeatureKey | "languageDetection" | null {
  for (const key of FEATURE_KEYS) {
    if (!getUsableProviderIdsForCapability(key, remainingProviders)[0]) {
      return key
    }
  }

  if (
    config?.languageDetection.mode === "llm" &&
    getUsableProviderIdsForCapability("languageDetection", remainingProviders).length === 0
  ) {
    return "languageDetection"
  }

  return null
}

/**
 * Compute languageDetection fallback when a provider is deleted.
 * Only applies when mode is "llm" and the deleted provider is the current one.
 * Returns the new providerId (first enabled LLM), or undefined if none available.
 * Returns null when no change is needed.
 */
export function computeLanguageDetectionFallbackAfterDeletion(
  deletedProviderId: string,
  config: Config,
  remainingProviders: ProvidersConfig,
): string | undefined | null {
  if (config.languageDetection.mode !== "llm") return null
  if (config.languageDetection.providerId !== deletedProviderId) return null

  return getUsableProviderIdsForCapability("languageDetection", remainingProviders)[0]
}
