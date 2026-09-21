import { describe, expect, it } from "vitest"
import { configSchema } from "@/types/config/config"
import { DEFAULT_CONFIG } from "@/utils/constants/config"

describe("interface language validation", () => {
  it.each(["auto", "en", "zh-CN"])("accepts %s", (uiLanguage) => {
    expect(configSchema.parse({ ...DEFAULT_CONFIG, uiLanguage }).uiLanguage).toBe(uiLanguage)
  })
  it.each(["es", "az", undefined])("rejects unsupported language %s", (uiLanguage) => {
    expect(configSchema.safeParse({ ...DEFAULT_CONFIG, uiLanguage }).success).toBe(false)
  })
})
