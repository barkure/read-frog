import { describe, expect, it } from "vitest"
import { CONFIG_SCHEMA_VERSION, DEFAULT_CONFIG } from "@/utils/constants/config"
import { parseConfigImport } from "../import"

describe("config import", () => {
  it("accepts current exports", () => {
    expect(
      parseConfigImport({ schemaVersion: CONFIG_SCHEMA_VERSION, config: DEFAULT_CONFIG }),
    ).toEqual(DEFAULT_CONFIG)
  })
  it.each([
    null,
    {},
    { schemaVersion: CONFIG_SCHEMA_VERSION - 1, config: DEFAULT_CONFIG },
    { schemaVersion: CONFIG_SCHEMA_VERSION + 1, config: DEFAULT_CONFIG },
    { schemaVersion: CONFIG_SCHEMA_VERSION, config: {} },
  ])("rejects unsupported or invalid imports", (payload) => {
    expect(() => parseConfigImport(payload)).toThrow(/.+/s)
  })
})
