export const MARGIN = 25

/** The lazy iframe trigger replays the gesture after React installs its listeners. */
export const DEFERRED_SELECTION_OPEN_EVENT = "read-frog:deferred-selection-open"
export const SELECTION_TOOLBAR_READY_EVENT = "read-frog:selection-toolbar-ready"

export interface DeferredSelectionOpenDetail {
  text: string
  x: number
  y: number
}

declare global {
  interface Window {
    __READ_FROG_SELECTION_TOOLBAR_READY__?: boolean
  }
}

export const MIN_SELECTION_OVERLAY_OPACITY = 1
export const MAX_SELECTION_OVERLAY_OPACITY = 100
export const DEFAULT_SELECTION_OVERLAY_OPACITY = 100
