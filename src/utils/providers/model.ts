import type { Config } from "@/types/config/config"
import type { LLMProviderConfig } from "@/types/config/provider"
import { createDeepSeek } from "@ai-sdk/deepseek"
import { storage } from "#imports"
import { getLLMProvidersConfig, getProviderConfigById } from "../config/helpers"
import { CONFIG_STORAGE_KEY } from "../constants/config"
import { getProviderHeaders } from "./headers"
import { resolveModelId } from "./model-id"

export async function getModelById(providerId: string) {
  const config = await storage.getItem<Config>(`local:${CONFIG_STORAGE_KEY}`)
  if (!config) {
    throw new Error("Config not found")
  }

  const LLMProvidersConfig = getLLMProvidersConfig(config.providersConfig)
  const providerConfig = getProviderConfigById(LLMProvidersConfig, providerId)
  if (!providerConfig) {
    throw new Error(`Provider ${providerId} not found`)
  }

  return getLanguageModelForConfig(providerConfig)
}

/**
 * Build a model from a config the caller already holds.
 *
 * Callers that were handed a provider config — a transported `providerRef`, say — must use this
 * rather than looking the id up again: re-reading storage picks up edits made after the ref was
 * captured, so the model would come from the new row while the params derived from the ref came
 * from the old one.
 */
export function getLanguageModelForConfig(providerConfig: LLMProviderConfig) {
  const headers = getProviderHeaders(providerConfig.headers)

  const provider = createDeepSeek({
    ...(providerConfig.baseURL && { baseURL: providerConfig.baseURL }),
    ...(providerConfig.apiKey && { apiKey: providerConfig.apiKey }),
    ...(headers && { headers }),
  })

  const modelId = resolveModelId(providerConfig.model)
  if (!modelId) {
    throw new Error("Model is undefined")
  }

  return provider.languageModel(modelId)
}
