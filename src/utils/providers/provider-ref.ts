import type { LocalProviderRef, ResolvedProviderRef } from "./provider-registry"
import type { Config } from "@/types/config/config"
import type { LLMProviderConfig, TranslateProviderConfig } from "@/types/config/provider"
import { isLLMProviderConfig } from "@/types/config/provider"
import { resolveProviderRefForCapability } from "./provider-registry"

/**
 * A provider flattened for structured-clone transport to the background. Local
 * providers carry their whole config, which is also their cache identity.
 */
export type SerializableProviderRef = { kind: "local"; config: TranslateProviderConfig }

/**
 * A ref that can be prompted for free-form text. Structural, not branded:
 * `LLMProviderConfig` is a real subtype of `TranslateProviderConfig`, so this
 * stays assignable to `SerializableProviderRef` — caches and transport see no
 * difference.
 *
 * Message payloads that prompt a model require this type, which turns
 * "forgot the promptability check" from a silent per-request failure into a
 * compile error at the sender: the only way to produce one is
 * `canProviderRefGenerateText` or a resolution that applied it.
 */
export type PromptableProviderRef = { kind: "local"; config: LLMProviderConfig }

export function resolvePageTranslationProvider(
  config: Config,
): ResolvedProviderRef<TranslateProviderConfig> {
  const resolved = resolveProviderRefForCapability(
    "pageTranslation",
    config.providersConfig,
    config.pageTranslation.providerId,
  )
  if (!resolved) {
    throw new Error(`No page translation provider for id "${config.pageTranslation.providerId}"`)
  }
  return resolved
}

export function resolvePageTranslationProviderOrNull(
  config: Config,
): ResolvedProviderRef<TranslateProviderConfig> | null {
  try {
    return resolvePageTranslationProvider(config)
  } catch {
    return null
  }
}

/**
 * Cache identity for a provider. Local providers hash their whole config, so a
 * changed key or provider options invalidates. One helper so every cache (page,
 * subtitles, summaries, segmentation) keys the same way.
 */
export function getProviderCacheIdentity(ref: SerializableProviderRef): string {
  return JSON.stringify(ref.config)
}

/**
 * Whether this ref can be prompted for free-form text.
 *
 * Capability and promptability are not the same question. A feature's provider
 * list is capability-gated — `videoSubtitles` admits any translate provider —
 * but a summary is a generation, and Google and Microsoft have no model
 * to prompt. Without this, enqueueing a summary for a translate-only subtitles
 * provider is admitted to the queue and can only ever throw, after burning its
 * retries.
 */
export function canProviderRefGenerateText(
  ref: SerializableProviderRef,
): ref is PromptableProviderRef {
  return isLLMProviderConfig(ref.config)
}

/**
 * Pre-serialization twin of `canProviderRefGenerateText`: the same
 * promptability question, asked of the registry's resolved ref. Keep the pair
 * in sync.
 */
export function canResolvedProviderRefGenerateText(
  ref: ResolvedProviderRef,
): ref is ResolvedProviderRef<LLMProviderConfig> {
  return isLLMProviderConfig(ref.config)
}

export async function serializeProviderRef<T extends TranslateProviderConfig>(
  provider: LocalProviderRef<T>,
): Promise<{ kind: "local"; config: T }> {
  return { kind: "local", config: provider.config }
}

export type ProviderAvailability<Ref extends SerializableProviderRef = SerializableProviderRef> =
  | { available: true; providerRef: Ref }
  | { available: false; message: string }
