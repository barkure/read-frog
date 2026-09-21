import { describe, expect, it } from "vitest"
import { resolveModelId } from "../model-id"

describe("resolveModelId", () => {
  it("returns a trimmed built-in model id", () => {
    expect(
      resolveModelId({
        isCustomModel: false,
        model: " deepseek-flash ",
        customModel: "",
      }),
    ).toBe("deepseek-flash")
  })

  it("returns a trimmed custom model id", () => {
    expect(
      resolveModelId({
        isCustomModel: true,
        model: "",
        customModel: " deepseek-v4-pro ",
      }),
    ).toBe("deepseek-v4-pro")
  })

  it("returns undefined when the selected field is empty", () => {
    // A stored config can carry a missing customModel; the schema's `string | null` does not admit
    // it, hence the cast rather than a type that would hide the case.
    expect(
      resolveModelId({
        isCustomModel: true,
        model: "ignored",
        customModel: undefined,
      } as unknown as Parameters<typeof resolveModelId>[0]),
    ).toBeUndefined()
  })
})
