import type { ProviderCapability } from "./provider-registry"
import type { ProvidersConfig } from "@/types/config/provider"
import { getProviderIdsForCapability } from "./provider-registry"

/**
 * The provider ids that can actually run this capability: enabled local rows
 * only. Callers that gate an action on "is there a provider for this feature"
 * want this rather than a bare presence check.
 */
export function getUsableProviderIdsForCapability(
  capability: ProviderCapability,
  providersConfig: ProvidersConfig,
): string[] {
  return getProviderIdsForCapability(capability, providersConfig, { requireEnable: true })
}
