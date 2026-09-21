import type { PartialDeep } from "type-fest"
import type { ProviderConfig } from "@/types/config/provider"
import { createStore } from "jotai"
import { describe, expect, it } from "vitest"
import { DEFAULT_CONFIG } from "@/utils/constants/config"
import { DEFAULT_PROVIDER_CONFIG } from "@/utils/constants/providers"
import { featureProviderRefAtom, updateLLMProviderConfig, updateProviderConfig } from "../provider"

type DeepSeekProviderConfig = Extract<ProviderConfig, { provider: "deepseek" }>

describe("provider config updates", () => {
  it("merges nested LLM model updates without changing untouched fields", () => {
    const result = updateLLMProviderConfig(DEFAULT_PROVIDER_CONFIG.deepseek, {
      model: {
        customModel: "deepseek-v4-pro-preview",
        isCustomModel: true,
      },
    })

    expect(result.model).toEqual({
      ...DEFAULT_PROVIDER_CONFIG.deepseek.model,
      customModel: "deepseek-v4-pro-preview",
      isCustomModel: true,
    })
    expect(result.provider).toBe("deepseek")
  })

  it("merges provider option objects and preserves the rest of the config", () => {
    const result = updateProviderConfig(DEFAULT_PROVIDER_CONFIG.deepseek, {
      providerOptions: {
        thinking: { type: "enabled" },
      },
    }) as DeepSeekProviderConfig

    expect(result.providerOptions).toEqual({ thinking: { type: "enabled" } })
    expect(result.model).toEqual(DEFAULT_PROVIDER_CONFIG.deepseek.model)
    expect(result.provider).toBe("deepseek")
  })

  it("merges provider headers and preserves the rest of the config", () => {
    const result = updateProviderConfig(DEFAULT_PROVIDER_CONFIG.deepseek, {
      headers: {
        "X-Test": "1",
      },
    }) as DeepSeekProviderConfig

    expect(result.headers).toEqual({ "X-Test": "1" })
    expect(result.model).toEqual(DEFAULT_PROVIDER_CONFIG.deepseek.model)
    expect(result.provider).toBe("deepseek")
  })

  it("rejects merged configs that no longer match the provider schema", () => {
    const invalidUpdates = {
      apiKey: 42,
    } as PartialDeep<ProviderConfig>

    expect(() =>
      updateProviderConfig(DEFAULT_PROVIDER_CONFIG["google-translate"], invalidUpdates),
    ).toThrow(/unrecognized_key/)
  })
})

describe("feature provider refs", () => {
  it("continues to resolve persisted providers as local refs", () => {
    const store = createStore()

    expect(store.get(featureProviderRefAtom("pageTranslation"))).toMatchObject({
      kind: "local",
      id: DEFAULT_CONFIG.pageTranslation.providerId,
    })
  })
})
