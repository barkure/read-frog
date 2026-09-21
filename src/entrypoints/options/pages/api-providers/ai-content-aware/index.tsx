import { useAtom } from "jotai"
import { Switch } from "@/components/ui/base-ui/switch"
import { configFieldsAtomMap } from "@/utils/atoms/config"
import { i18n } from "@/utils/i18n"
import { ConfigItem } from "../../../components/config-item"
import { ConfigSection } from "../../../components/config-section"

/**
 * One global switch. It applies to every feature that runs on DeepSeek, so
 * there is nothing per-feature to configure here.
 */
export function AIContentAwareConfig() {
  const [translateConfig, setTranslateConfig] = useAtom(configFieldsAtomMap.pageTranslation)

  return (
    <ConfigSection
      id="ai-content-aware"
      title={i18n.t("options.apiProviders.aiContentAware.title")}
    >
      <ConfigItem
        title={i18n.t("options.apiProviders.aiContentAware.enable")}
        description={i18n.t("options.apiProviders.aiContentAware.enableDescription")}
      >
        <Switch
          checked={translateConfig.enableAIContentAware}
          onCheckedChange={(checked) => {
            void setTranslateConfig({ enableAIContentAware: checked })
          }}
        />
      </ConfigItem>
    </ConfigSection>
  )
}
