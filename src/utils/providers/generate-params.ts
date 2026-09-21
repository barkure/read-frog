import type { JSONValue } from "ai"
import type { LLMProviderConfig } from "@/types/config/provider"
import { buildProviderOptions } from "@/utils/providers/options"

export interface LocalGenerateTextParams {
  providerOptions: Record<string, Record<string, JSONValue>> | undefined
}

/**
 * The per-provider knobs every non-streaming local call passes to the AI SDK. Extracted because
 * the article summary, subtitle segmentation, and language detection paths all need exactly the
 * same payload.
 *
 * Sampling parameters are deliberately absent. DeepSeek is the only model-backed provider in this
 * build, and its API defaults are what the extension runs on — no temperature, no thinking mode.
 */
export function buildLocalGenerateTextParams(config: LLMProviderConfig): LocalGenerateTextParams {
  return {
    providerOptions: buildProviderOptions(config.provider, config.providerOptions),
  }
}
