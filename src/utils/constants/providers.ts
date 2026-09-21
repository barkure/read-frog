import type {
  AllProviderTypes,
  APIProviderTypes,
  ProviderConfig,
  ProvidersConfig,
} from "@/types/config/provider"
import type { Theme } from "@/types/config/theme"
import { camelCase } from "case-anything"
import {
  API_PROVIDER_TYPES,
  NON_API_TRANSLATE_PROVIDERS_MAP,
  isAPIProviderConfig,
} from "@/types/config/provider"
import { pick } from "@/types/utils"
import { i18n } from "@/utils/i18n"
import { getLobeIconsCDNUrlFn } from "../logo"

/**
 * The model a freshly created provider starts on.
 *
 * Its model id is a plain string in the schema (see `deepseekProviderConfigSchema`), so this is a
 * starting point rather than a constraint.
 */
export const DEFAULT_LLM_PROVIDER_MODELS = {
  deepseek: {
    model: "deepseek-flash",
    isCustomModel: false,
    customModel: null,
  },
} as const

interface ProviderItem {
  logo: (theme: Theme) => string
  name: string
  /**
   * Where the provider lives. The header links to it, so a provider without a product page (which
   * is why the custom-endpoint protocols had none) simply renders as text.
   */
  website?: string
}

export const PROVIDER_ITEMS: Record<AllProviderTypes, ProviderItem> = {
  "microsoft-translate": {
    logo: getLobeIconsCDNUrlFn("microsoft-color"),
    name: NON_API_TRANSLATE_PROVIDERS_MAP["microsoft-translate"],
    website: "https://translator.microsoft.com",
  },
  "google-translate": {
    logo: getLobeIconsCDNUrlFn("google-color"),
    name: NON_API_TRANSLATE_PROVIDERS_MAP["google-translate"],
    website: "https://translate.google.com",
  },
  deepseek: {
    logo: getLobeIconsCDNUrlFn("deepseek-color"),
    name: "DeepSeek",
    website: "https://platform.deepseek.com",
  },
}

export const DEFAULT_PROVIDER_CONFIG = {
  "google-translate": {
    id: "google-translate-default",
    name: PROVIDER_ITEMS["google-translate"].name,
    enabled: true,
    provider: "google-translate",
  },
  "microsoft-translate": {
    id: "microsoft-translate-default",
    name: PROVIDER_ITEMS["microsoft-translate"].name,
    enabled: true,
    provider: "microsoft-translate",
  },
  deepseek: {
    id: "deepseek-default",
    name: PROVIDER_ITEMS.deepseek.name,
    enabled: true,
    provider: "deepseek",
    model: DEFAULT_LLM_PROVIDER_MODELS.deepseek,
  },
} as const satisfies Record<AllProviderTypes, ProviderConfig>

export const GOOGLE_TRANSLATE_PROVIDER_ID = DEFAULT_PROVIDER_CONFIG["google-translate"].id
export const MICROSOFT_TRANSLATE_PROVIDER_ID = DEFAULT_PROVIDER_CONFIG["microsoft-translate"].id

/** Placeholder shown in the Base URL field; the provider's own endpoint unless noted. */
export const PROVIDER_URL_PLACEHOLDERS: Partial<Record<APIProviderTypes, string>> = {
  deepseek: "https://api.deepseek.com",
}

export const DEFAULT_PROVIDER_CONFIG_LIST: ProvidersConfig = [
  DEFAULT_PROVIDER_CONFIG["google-translate"],
  DEFAULT_PROVIDER_CONFIG["microsoft-translate"],
  DEFAULT_PROVIDER_CONFIG.deepseek,
]

/** Resolve a provider's default description in the active interface language. */
export function getDefaultProviderDescription(providerType: APIProviderTypes): string | undefined {
  const descriptionKey = camelCase(providerType)
  const description = i18n.t(
    `options.apiProviders.providers.description.${descriptionKey}` as never,
  )
  return description || undefined
}

/**
 * Build providers for a fresh config after i18n has initialized, so descriptions are
 * persisted in the same interface language as the rest of the UI.
 */
export function buildDefaultProviderConfigList(): ProvidersConfig {
  return structuredClone(DEFAULT_PROVIDER_CONFIG_LIST).map((providerConfig) => {
    if (!isAPIProviderConfig(providerConfig)) {
      return providerConfig
    }

    const description = getDefaultProviderDescription(providerConfig.provider)
    return description ? { ...providerConfig, description } : providerConfig
  })
}

export const API_PROVIDER_ITEMS = pick(PROVIDER_ITEMS, API_PROVIDER_TYPES)
