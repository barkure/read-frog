import { beforeEach, describe, expect, it, vi } from "vitest"
import { storage } from "#imports"
import { DEFAULT_PROVIDER_CONFIG } from "@/utils/constants/providers"

let getStorageItemMock: ReturnType<typeof vi.fn>

const { deepSeekLanguageModelMock, createDeepSeekMock } = vi.hoisted(() => {
  const innerDeepSeekLanguageModelMock = vi.fn<(...args: any[]) => any>()
  const innerCreateDeepSeekMock = vi.fn<(...args: any[]) => any>(
    (_options?: Record<string, unknown>) => ({
      languageModel: innerDeepSeekLanguageModelMock,
    }),
  )

  return {
    deepSeekLanguageModelMock: innerDeepSeekLanguageModelMock,
    createDeepSeekMock: innerCreateDeepSeekMock,
  }
})

vi.mock("@ai-sdk/deepseek", () => ({
  createDeepSeek: createDeepSeekMock,
}))

function createDeepSeekProviderConfig(overrides: Record<string, unknown> = {}) {
  return {
    ...DEFAULT_PROVIDER_CONFIG.deepseek,
    apiKey: "test-key",
    ...overrides,
  }
}

describe("getModelById", () => {
  beforeEach(() => {
    vi.clearAllMocks()
    deepSeekLanguageModelMock.mockReturnValue("deepseek-model")
    getStorageItemMock = vi.fn<(...args: any[]) => any>()
    ;(storage.getItem as unknown as ReturnType<typeof vi.fn>) = getStorageItemMock
  })

  it("builds the configured model and passes the key and model id through", async () => {
    getStorageItemMock.mockResolvedValue({
      providersConfig: [createDeepSeekProviderConfig()],
    })

    const { getModelById } = await import("../model")
    const result = await getModelById("deepseek-default")

    expect(result).toBe("deepseek-model")
    expect(createDeepSeekMock).toHaveBeenCalledWith(expect.objectContaining({ apiKey: "test-key" }))
    expect(deepSeekLanguageModelMock).toHaveBeenCalledWith("deepseek-flash")
  })

  it("passes a base URL only when the config sets one", async () => {
    getStorageItemMock.mockResolvedValue({
      providersConfig: [createDeepSeekProviderConfig()],
    })

    const { getModelById } = await import("../model")
    await getModelById("deepseek-default")

    expect(createDeepSeekMock).toHaveBeenCalledWith(
      expect.not.objectContaining({ baseURL: expect.anything() }),
    )
  })

  it("forwards a configured gateway base URL", async () => {
    getStorageItemMock.mockResolvedValue({
      providersConfig: [
        createDeepSeekProviderConfig({ baseURL: "https://gateway.example.com/v1" }),
      ],
    })

    const { getModelById } = await import("../model")
    await getModelById("deepseek-default")

    expect(createDeepSeekMock).toHaveBeenCalledWith(
      expect.objectContaining({ baseURL: "https://gateway.example.com/v1" }),
    )
  })

  it("drops header entries that are not usable header values", async () => {
    getStorageItemMock.mockResolvedValue({
      providersConfig: [createDeepSeekProviderConfig({ headers: { "X-Keep": "1", "X-Drop": "" } })],
    })

    const { getModelById } = await import("../model")
    await getModelById("deepseek-default")

    expect(createDeepSeekMock).toHaveBeenCalledWith(
      expect.objectContaining({ headers: { "X-Keep": "1" } }),
    )
  })

  it("resolves a custom model id", async () => {
    getStorageItemMock.mockResolvedValue({
      providersConfig: [
        createDeepSeekProviderConfig({
          model: {
            model: "deepseek-flash",
            isCustomModel: true,
            customModel: "  deepseek-v4-pro ",
          },
        }),
      ],
    })

    const { getModelById } = await import("../model")
    await getModelById("deepseek-default")

    expect(deepSeekLanguageModelMock).toHaveBeenCalledWith("deepseek-v4-pro")
  })

  it("throws when the provider is not in the config", async () => {
    getStorageItemMock.mockResolvedValue({ providersConfig: [] })

    const { getModelById } = await import("../model")

    await expect(getModelById("deepseek-default")).rejects.toThrow(/not found/)
  })
})
