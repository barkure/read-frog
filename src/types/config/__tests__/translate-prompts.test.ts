import { describe, expect, it } from "vitest"
import { subtitleCustomPromptsConfigSchema } from "../subtitles"
import { pageCustomPromptsConfigSchema } from "../translate"

const customPrompt = {
  id: "my-custom-prompt",
  name: "My prompt",
  systemPrompt: "Translate carefully.",
  prompt: "{{input}}",
}

describe("built-in translation prompt config", () => {
  it.each(["default", "precision-rewrite"])("accepts page built-in %s", (promptId) => {
    expect(
      pageCustomPromptsConfigSchema.parse({
        promptId,
        patterns: [],
      }),
    ).toEqual({ promptId, patterns: [] })
  })

  it("accepts only default as a subtitle built-in", () => {
    expect(
      subtitleCustomPromptsConfigSchema.safeParse({ promptId: "default", patterns: [] }).success,
    ).toBe(true)
    expect(
      subtitleCustomPromptsConfigSchema.safeParse({
        promptId: "precision-rewrite",
        patterns: [],
      }).success,
    ).toBe(false)
  })

  it.each([pageCustomPromptsConfigSchema, subtitleCustomPromptsConfigSchema])(
    "rejects legacy null selections",
    (schema) => {
      expect(schema.safeParse({ promptId: null, patterns: [] }).success).toBe(false)
    },
  )

  it.each([pageCustomPromptsConfigSchema, subtitleCustomPromptsConfigSchema])(
    "accepts and selects a custom prompt",
    (schema) => {
      expect(
        schema.safeParse({ promptId: customPrompt.id, patterns: [customPrompt] }).success,
      ).toBe(true)
    },
  )

  it.each(["default", "precision-rewrite"])("rejects reserved custom prompt id %s", (id) => {
    expect(
      pageCustomPromptsConfigSchema.safeParse({ promptId: id, patterns: [{ ...customPrompt, id }] })
        .success,
    ).toBe(false)
  })

  it.each([pageCustomPromptsConfigSchema, subtitleCustomPromptsConfigSchema])(
    "rejects an unknown selected prompt id",
    (schema) => {
      expect(schema.safeParse({ promptId: "missing", patterns: [customPrompt] }).success).toBe(
        false,
      )
    },
  )
})
