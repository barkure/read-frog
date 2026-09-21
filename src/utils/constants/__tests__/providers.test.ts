import { describe, expect, it } from "vitest"
import {
  ALL_PROVIDER_TYPES,
  API_PROVIDER_TYPES,
  LLM_PROVIDER_TYPES,
  apiProviderConfigItemSchema,
  providerConfigItemSchema,
  providersConfigSchema,
} from "@/types/config/provider"
import {
  DEFAULT_PROVIDER_CONFIG,
  DEFAULT_PROVIDER_CONFIG_LIST,
  PROVIDER_ITEMS,
  PROVIDER_URL_PLACEHOLDERS,
} from "../providers"

describe("provider constants", () => {
  it("keeps every default provider compatible with its schema", () => {
    for (const provider of ALL_PROVIDER_TYPES) {
      expect(providerConfigItemSchema.parse(DEFAULT_PROVIDER_CONFIG[provider])).toEqual(
        DEFAULT_PROVIDER_CONFIG[provider],
      )
    }
  })

  it("ships the closed catalog the docs describe", () => {
    expect(API_PROVIDER_TYPES).toEqual(["deepseek"])
    expect(LLM_PROVIDER_TYPES).toEqual(["deepseek"])
    expect(ALL_PROVIDER_TYPES).toEqual(["google-translate", "microsoft-translate", "deepseek"])
    expect(DEFAULT_PROVIDER_CONFIG_LIST.map((provider) => provider.provider)).toEqual([
      "google-translate",
      "microsoft-translate",
      "deepseek",
    ])
  })

  it("names the endpoint DeepSeek is called on", () => {
    expect(PROVIDER_URL_PLACEHOLDERS.deepseek).toBe("https://api.deepseek.com")
    expect(PROVIDER_ITEMS.deepseek.website).toBe("https://platform.deepseek.com")
  })

  it("defines DeepSeek with the current model and no sampling overrides", () => {
    // Sampling (temperature, thinking mode) is deliberately absent: the extension runs on
    // DeepSeek's own API defaults.
    expect(DEFAULT_PROVIDER_CONFIG.deepseek).toEqual(
      expect.objectContaining({
        id: "deepseek-default",
        name: "DeepSeek",
        provider: "deepseek",
        model: {
          model: "deepseek-flash",
          isCustomModel: false,
          customModel: null,
        },
      }),
    )
    expect(DEFAULT_PROVIDER_CONFIG.deepseek).not.toHaveProperty("reasoning")
    expect(DEFAULT_PROVIDER_CONFIG.deepseek).not.toHaveProperty("temperature")
  })

  it("gives the keyless providers nothing to configure", () => {
    for (const provider of ["google-translate", "microsoft-translate"] as const) {
      expect(DEFAULT_PROVIDER_CONFIG[provider]).not.toHaveProperty("apiKey")
      expect(DEFAULT_PROVIDER_CONFIG[provider]).not.toHaveProperty("model")
      expect(DEFAULT_PROVIDER_CONFIG[provider]).not.toHaveProperty("baseURL")
    }
  })

  it("rejects retired sampling fields", () => {
    expect(
      apiProviderConfigItemSchema.safeParse({
        ...DEFAULT_PROVIDER_CONFIG.deepseek,
        temperature: 0.2,
        reasoning: "low",
      }).success,
    ).toBe(false)
  })

  it("accepts a custom model identifier", () => {
    expect(
      apiProviderConfigItemSchema.parse({
        ...DEFAULT_PROVIDER_CONFIG.deepseek,
        model: { model: "custom-model", isCustomModel: true, customModel: "custom-model" },
      }),
    ).toMatchObject({ model: { customModel: "custom-model" } })
  })

  it("rejects unsupported provider rows", () => {
    expect(
      providersConfigSchema.safeParse([
        ...DEFAULT_PROVIDER_CONFIG_LIST,
        { id: "openai-default", name: "OpenAI", enabled: true, provider: "openai" },
      ]).success,
    ).toBe(false)
  })
})
