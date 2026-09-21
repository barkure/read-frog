import { configSchema } from "@/types/config/config"
import { CONFIG_SCHEMA_VERSION } from "@/utils/constants/config"
import { i18n } from "@/utils/i18n"

export function parseConfigImport(payload: unknown) {
  if (
    !payload ||
    typeof payload !== "object" ||
    !("schemaVersion" in payload) ||
    payload.schemaVersion !== CONFIG_SCHEMA_VERSION
  ) {
    throw new Error(i18n.t("options.configMigration.versionMismatch"))
  }
  return configSchema.parse("config" in payload ? payload.config : undefined)
}
