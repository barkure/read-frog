// @vitest-environment jsdom
import type * as React from "react"
import { render, screen } from "@testing-library/react"
import { describe, expect, it, vi } from "vitest"
import { SelectionToolbarTitleContent } from "../selection-toolbar-title-content"

vi.mock("@/components/ui/selection-popover", () => ({
  SelectionPopover: {
    Title: ({ children, className }: { children: React.ReactNode; className?: string }) => (
      <span className={className}>{children}</span>
    ),
  },
}))

describe("selectionToolbarTitleContent", () => {
  it("renders the translation icon with the muted foreground color", () => {
    render(<SelectionToolbarTitleContent title="Translation" />)

    expect(screen.getByText("Translation")).toBeInTheDocument()
    expect(document.querySelector("svg")).toHaveClass("text-muted-foreground")
  })
})
