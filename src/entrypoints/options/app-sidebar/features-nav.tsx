import { IconChevronRight, IconLanguage, IconLayersIntersect } from "@tabler/icons-react"
import { Link, useLocation } from "react-router"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/base-ui/collapsible"
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/base-ui/sidebar"
import { i18n } from "@/utils/i18n"

const OVERLAY_TOOLS_PATHS = ["/floating-button", "/selection-toolbar", "/context-menu"] as const
/**
 * The three places a translation happens. Grouped because they are one feature
 * seen in three surfaces — a page, a video, a text box — and listing them flat
 * put three of the eight top-level entries on the same subject.
 *
 * `startsWith`, because two of them own detail pages (`/page-translation/prompts`
 * and the rest), and the group has to stay lit while one is open.
 */
const TRANSLATION_PATHS = ["/page-translation", "/video-subtitles", "/input-translation"] as const

export function FeaturesNav() {
  const { pathname } = useLocation()
  const isOverlayToolsActive = OVERLAY_TOOLS_PATHS.includes(pathname)
  const isTranslationActive = TRANSLATION_PATHS.some((path) => pathname.startsWith(path))

  return (
    <SidebarGroup>
      <SidebarGroupLabel>{i18n.t("options.sidebar.features")}</SidebarGroupLabel>
      <SidebarGroupContent>
        <SidebarMenu>
          <Collapsible defaultOpen={isTranslationActive} className="group/collapsible">
            <SidebarMenuItem>
              <CollapsibleTrigger
                render={
                  <SidebarMenuButton
                    isActive={isTranslationActive}
                    tooltip={i18n.t("options.sidebar.translation")}
                  />
                }
              >
                {/* Page translation's own icon stands for the group: it is the
                    feature the other two are variations of. */}
                <IconLanguage />
                <span>{i18n.t("options.sidebar.translation")}</span>
                <IconChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
              </CollapsibleTrigger>
              <CollapsibleContent>
                <SidebarMenuSub>
                  <SidebarMenuSubItem>
                    <SidebarMenuSubButton
                      render={<Link to="/page-translation" />}
                      isActive={pathname.startsWith("/page-translation")}
                    >
                      <span>{i18n.t("options.translation.title")}</span>
                    </SidebarMenuSubButton>
                  </SidebarMenuSubItem>
                  <SidebarMenuSubItem>
                    <SidebarMenuSubButton
                      render={<Link to="/video-subtitles" />}
                      isActive={pathname.startsWith("/video-subtitles")}
                    >
                      <span>{i18n.t("options.videoSubtitles.title")}</span>
                    </SidebarMenuSubButton>
                  </SidebarMenuSubItem>
                  <SidebarMenuSubItem>
                    <SidebarMenuSubButton
                      render={<Link to="/input-translation" />}
                      isActive={pathname === "/input-translation"}
                    >
                      <span>{i18n.t("options.inputTranslation.title")}</span>
                    </SidebarMenuSubButton>
                  </SidebarMenuSubItem>
                </SidebarMenuSub>
              </CollapsibleContent>
            </SidebarMenuItem>
          </Collapsible>

          <Collapsible defaultOpen={isOverlayToolsActive} className="group/collapsible">
            <SidebarMenuItem>
              <CollapsibleTrigger
                render={
                  <SidebarMenuButton
                    isActive={isOverlayToolsActive}
                    tooltip={i18n.t("options.overlayTools.title")}
                  />
                }
              >
                <IconLayersIntersect />
                <span>{i18n.t("options.overlayTools.title")}</span>
                <IconChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
              </CollapsibleTrigger>
              <CollapsibleContent>
                <SidebarMenuSub>
                  <SidebarMenuSubItem>
                    <SidebarMenuSubButton
                      render={<Link to="/floating-button" />}
                      isActive={pathname === "/floating-button"}
                    >
                      <span>{i18n.t("options.floatingButton.title")}</span>
                    </SidebarMenuSubButton>
                  </SidebarMenuSubItem>
                  <SidebarMenuSubItem>
                    <SidebarMenuSubButton
                      render={<Link to="/selection-toolbar" />}
                      isActive={pathname === "/selection-toolbar"}
                    >
                      <span>{i18n.t("options.selectionToolbar.title")}</span>
                    </SidebarMenuSubButton>
                  </SidebarMenuSubItem>
                  <SidebarMenuSubItem>
                    <SidebarMenuSubButton
                      render={<Link to="/context-menu" />}
                      isActive={pathname === "/context-menu"}
                    >
                      <span>{i18n.t("options.contextMenu.title")}</span>
                    </SidebarMenuSubButton>
                  </SidebarMenuSubItem>
                </SidebarMenuSub>
              </CollapsibleContent>
            </SidebarMenuItem>
          </Collapsible>
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  )
}
