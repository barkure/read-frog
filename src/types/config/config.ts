import { langCodeISO6393Schema, langLevel } from "@read-frog/definitions"
import { z } from "zod"
import { FEATURE_KEYS, FEATURE_PROVIDER_DEFS } from "@/utils/constants/feature-providers"
import {
  MAX_SELECTION_OVERLAY_OPACITY,
  MIN_SELECTION_OVERLAY_OPACITY,
} from "@/utils/constants/selection"
import {
  doesProviderSupportsCapability,
  getProviderIdsForCapability,
} from "@/utils/providers/provider-registry"
import { floatingButtonSchema } from "./floating-button"
import { languageDetectionConfigSchema } from "./language-detection"
import { providersConfigSchema } from "./provider"
import { siteRulesConfigSchema } from "./site-rules"
import { videoSubtitlesSchema } from "./subtitles"
import { pageTranslationShortcutSchema, translateConfigSchema } from "./translate"

// Language schema
const languageSchema = z.object({
  sourceCode: langCodeISO6393Schema.or(z.literal("auto")),
  targetCode: langCodeISO6393Schema,
  level: langLevel,
})

const selectionToolbarFeatureSchema = z.object({
  enabled: z.boolean(),
  providerId: z.string().nonempty(),
  shortcut: pageTranslationShortcutSchema,
})

// Text selection toolbar schema
const selectionToolbarSchema = z.object({
  enabled: z.boolean(),
  disabledSelectionToolbarPatterns: z.array(z.string()),
  opacity: z.number().min(MIN_SELECTION_OVERLAY_OPACITY).max(MAX_SELECTION_OVERLAY_OPACITY),
  features: z.object({
    translate: selectionToolbarFeatureSchema,
  }),
})

// context menu schema
const contextMenuSchema = z.object({
  enabled: z.boolean(),
})

// input translation language selector: 'sourceCode', 'targetCode', or fixed language code
const inputTranslationLangSchema = z.union([
  z.literal("sourceCode"),
  z.literal("targetCode"),
  langCodeISO6393Schema,
])

// input translation schema (triple-space trigger)
const inputTranslationSchema = z.object({
  enabled: z.boolean(),
  providerId: z.string().nonempty(),
  fromLang: inputTranslationLangSchema,
  toLang: inputTranslationLangSchema,
  enableCycle: z.boolean(),
  timeThreshold: z.number().min(100).max(1000),
})

// Export types for use in components
export type InputTranslationLang = z.infer<typeof inputTranslationLangSchema>

// site control schema
const siteControlSchema = z.object({
  mode: z.enum(["blacklist", "whitelist"]),
  blacklistPatterns: z.array(z.string()),
  whitelistPatterns: z.array(z.string()),
})

const uiLanguageSchema = z.enum(["auto", "en", "zh-CN"])
export type UiLanguage = z.infer<typeof uiLanguageSchema>

const configObjectSchema = z.object({
  language: languageSchema,
  providersConfig: providersConfigSchema,
  pageTranslation: translateConfigSchema,
  languageDetection: languageDetectionConfigSchema,
  floatingButton: floatingButtonSchema,
  selectionToolbar: selectionToolbarSchema,
  contextMenu: contextMenuSchema,
  inputTranslation: inputTranslationSchema,
  videoSubtitles: videoSubtitlesSchema,
  siteControl: siteControlSchema,
  siteRules: siteRulesConfigSchema,
  uiLanguage: uiLanguageSchema,
})

// Complete config schema
export const configSchema = configObjectSchema.superRefine((data, ctx) => {
  for (const featureKey of FEATURE_KEYS) {
    const def = FEATURE_PROVIDER_DEFS[featureKey]
    const providerId = def.getProviderId(data)
    const candidates = getProviderIdsForCapability(featureKey, data.providersConfig, {
      requireEnable: true,
    })

    // A capability with no candidate left is not a broken reference but an
    // empty slot: the feature is inert until the user configures a provider
    // for it, which is a state the UI already renders.
    if (candidates.length === 0) continue

    if (
      !doesProviderSupportsCapability(featureKey, data.providersConfig, providerId, {
        requireEnable: true,
      })
    ) {
      ctx.addIssue({
        code: "invalid_value",
        values: candidates,
        message: `Invalid provider id "${providerId}".`,
        path: [...def.configPath],
      })
      continue
    }
  }

  // Validate languageDetection: when mode is "llm", providerId must be a valid enabled LLM provider
  if (data.languageDetection.mode === "llm") {
    const ldProviderId = data.languageDetection.providerId
    if (!ldProviderId) {
      ctx.addIssue({
        code: "custom",
        message: `Language detection mode is "llm" but no providerId is configured.`,
        path: ["languageDetection", "providerId"],
      })
    } else if (
      !doesProviderSupportsCapability("languageDetection", data.providersConfig, ldProviderId, {
        requireEnable: true,
      })
    ) {
      ctx.addIssue({
        code: "invalid_value",
        values: getProviderIdsForCapability("languageDetection", data.providersConfig, {
          requireEnable: true,
        }),
        message: `Invalid provider id "${ldProviderId}".`,
        path: ["languageDetection", "providerId"],
      })
    }
  }
})

export type Config = z.infer<typeof configSchema>
