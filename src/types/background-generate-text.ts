import type { ProviderRequestRouting } from "./provider-routing"
import type { PromptableProviderRef } from "@/utils/providers/provider-ref"

export type BackgroundGenerateTextPayload = ProviderRequestRouting<PromptableProviderRef> & {
  instructions: string
  prompt: string
  maxRetries?: number
}

export interface BackgroundGenerateTextResponse {
  text: string
}
