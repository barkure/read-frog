import { describe, expect, it } from "vitest"
import { checkPromptConfig } from "../prompt-file"

describe("prompt file validation", () => {
  it("accepts current prompt exports", () => {
    expect(checkPromptConfig([{ name: "Translate", systemPrompt: "", prompt: "{{input}}" }])).toBe(
      true,
    )
  })
  it.each([
    null,
    {},
    [null],
    [{ name: "Old", prompt: "{{input}}" }],
    [{ name: "Invalid", systemPrompt: 1, prompt: "{{input}}" }],
  ])("rejects malformed or old prompt files", (payload) => {
    expect(checkPromptConfig(payload)).toBe(false)
  })
})
