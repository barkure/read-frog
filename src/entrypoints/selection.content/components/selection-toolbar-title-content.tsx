import type { ReactNode } from "react"
import { IconLanguage } from "@tabler/icons-react"
import { SelectionPopover } from "@/components/ui/selection-popover"
import { cn } from "@/utils/styles/utils"

export function SelectionToolbarTitleContent({
  className,
  title,
}: {
  className?: string
  title: ReactNode
}) {
  return (
    <div className={cn("flex min-w-0 items-center gap-2", className)}>
      <IconLanguage strokeWidth={0.8} className="size-4.5 shrink-0 text-muted-foreground" />
      <SelectionPopover.Title className="truncate">{title}</SelectionPopover.Title>
    </div>
  )
}
