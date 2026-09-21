import type { LLMProviderConfig } from "@/types/config/provider"
import { beforeEach, describe, expect, it, vi } from "vitest"
import { getRequestErrorMeta } from "@/utils/request/retry-policy"
import { aiTranslate } from "../ai"

const mocks = vi.hoisted(() => ({
  generateText: vi.fn<(...args: any[]) => any>(),
  getModelById: vi.fn<(...args: any[]) => any>(),
  buildProviderOptions: vi.fn<(...args: any[]) => any>(),
}))

vi.mock("ai", () => ({
  generateText: mocks.generateText,
}))

vi.mock("@/utils/providers/model", () => ({
  getModelById: mocks.getModelById,
}))

vi.mock("@/utils/providers/options", () => ({
  buildProviderOptions: mocks.buildProviderOptions,
}))

const providerConfig: LLMProviderConfig = {
  id: "deepseek-default",
  name: "DeepSeek",
  provider: "deepseek",
  enabled: true,
  apiKey: "sk-test",
  model: { model: "deepseek-flash", isCustomModel: false, customModel: null },
}

const promptResolver = vi.fn<(...args: any[]) => any>().mockResolvedValue({
  systemPrompt: "system",
  prompt: "prompt",
})

describe("aiTranslate", () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mocks.getModelById.mockResolvedValue("model")
    mocks.buildProviderOptions.mockReturnValue(undefined)
  })

  it("preserves AI SDK error metadata for retry policy decisions", async () => {
    const rateLimitedError = Object.assign(new Error("Too Many Requests"), {
      statusCode: 429,
      isRetryable: true,
      responseHeaders: {
        "retry-after": "2",
      },
    })
    mocks.generateText.mockRejectedValue(rateLimitedError)

    const error = await aiTranslate("hello", "Chinese", providerConfig, promptResolver).catch(
      (caughtError) => caughtError,
    )

    expect(error).toBe(rateLimitedError)
    expect(getRequestErrorMeta(error)).toEqual(
      expect.objectContaining({
        statusCode: 429,
        isRetryable: true,
        retryAfterMs: 2000,
        kind: "rate-limit",
      }),
    )
  })

  it("preserves response body as the display message when the AI SDK message is generic", async () => {
    const responseBody = '{"code":404,"message":"模型 Kimi-K2-Instruct-09051 无效","data":{}}'
    const invalidModelError = Object.assign(new Error("Something went wrong"), {
      statusCode: 404,
      isRetryable: false,
      responseBody,
    })
    mocks.generateText.mockRejectedValue(invalidModelError)

    const error = await aiTranslate("hello", "Chinese", providerConfig, promptResolver).catch(
      (caughtError) => caughtError,
    )

    expect(error).toBe(invalidModelError)
    expect(error.message).toBe(responseBody)
    expect(getRequestErrorMeta(error)).toEqual(
      expect.objectContaining({
        statusCode: 404,
        isRetryable: false,
        kind: "bad-request",
      }),
    )
  })
})
