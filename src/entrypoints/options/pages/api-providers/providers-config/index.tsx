import { useSetAtom } from "jotai"
import { useEffect, useRef } from "react"
import { useLocation } from "react-router"
import { i18n } from "@/utils/i18n"
import { PROVIDER_CONFIG_SECTION_ID, shouldHighlightApiKey } from "@/utils/navigation"
import { ConfigItem } from "../../../components/config-item"
import { highlightedProviderFieldAtom } from "./atoms"
import { ProviderConfigForm } from "./provider-config-form"

/**
 * Flashes the API key field when a deep link asks for it — the shape an API-key prompt elsewhere in
 * the app links with. Only that one field needs the treatment now that the page has a single
 * provider: there is nothing to select, so the link's provider id no longer has to be resolved.
 */
function useApiKeyHighlightRequest() {
  const { search, key: locationKey } = useLocation()
  const setHighlightedField = useSetAtom(highlightedProviderFieldAtom)
  const handledLocationRef = useRef<string | null>(null)

  useEffect(() => {
    const marker = `${locationKey}:${search}`
    if (handledLocationRef.current === marker) return
    if (!shouldHighlightApiKey(search)) return

    handledLocationRef.current = marker
    setHighlightedField("apiKey")
  }, [locationKey, search, setHighlightedField])
}

/**
 * Provider Config.
 *
 * DeepSeek's settings, shown directly. There is no catalog to browse and one provider that has any
 * settings at all, so the list of provider cards that used to sit beside the form is gone:
 * Google Translate and Microsoft Translator need no key and appear only where a feature picks its
 * provider.
 */
export function ProvidersConfig() {
  useApiKeyHighlightRequest()

  return (
    <ConfigItem
      id={PROVIDER_CONFIG_SECTION_ID}
      orientation="vertical"
      title={i18n.t("options.apiProviders.configTitle")}
    >
      <ProviderConfigForm />
    </ConfigItem>
  )
}
