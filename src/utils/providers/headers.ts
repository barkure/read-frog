/** Keep only nonempty string headers from the provider configuration. */
export function getProviderHeaders(
  userHeaders?: Record<string, unknown>,
): Record<string, string> | undefined {
  if (!userHeaders) {
    return undefined
  }

  const compacted = Object.fromEntries(
    Object.entries(userHeaders).filter((entry): entry is [string, string] => {
      const [, value] = entry
      return typeof value === "string" && value !== ""
    }),
  )

  return Object.keys(compacted).length > 0 ? compacted : undefined
}
