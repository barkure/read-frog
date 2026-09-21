import type { JSONValue } from "ai"

/**
 * The AI SDK request shape for a provider's own saved options.
 *
 * There is no recommendation layer any more. The only model-backed provider in this build is
 * DeepSeek, and its sampling is left entirely to the API's own defaults — nothing is injected, so
 * only options a stored config actually carries are ever sent.
 */
export function buildProviderOptions(
  provider: string,
  userOptions?: Record<string, JSONValue>,
): Record<string, Record<string, JSONValue>> | undefined {
  return userOptions ? { [provider]: userOptions } : undefined
}
