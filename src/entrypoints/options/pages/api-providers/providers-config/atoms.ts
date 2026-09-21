import { atom } from "jotai"

/**
 * The field a deep link asked Provider Config to draw attention to. Held as state rather than read
 * from the URL where it is needed, because the field mounts well after the navigation that asked
 * for it.
 */
export const highlightedProviderFieldAtom = atom<"apiKey" | null>(null)

/**
 * How long `--animate-ring-flash` runs end to end (see `src/assets/styles/theme.css`). The
 * highlight clears on this timer rather than on `animationend`, which never fires for anyone
 * browsing with reduced motion.
 */
export const PROVIDER_FIELD_HIGHLIGHT_DURATION_MS = 2700
