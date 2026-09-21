import type { APIProviderTypes } from "@/types/config/provider"
import ProviderIcon from "@/components/provider-icon"
import { useTheme } from "@/components/providers/theme-provider"
import { PROVIDER_ITEMS } from "@/utils/constants/providers"

export function ConfigHeader({ providerType }: { providerType: APIProviderTypes }) {
  const { theme } = useTheme()
  const providerItem = PROVIDER_ITEMS[providerType]

  const icon = (
    <ProviderIcon
      logo={providerItem.logo(theme)}
      name={PROVIDER_ITEMS[providerType].name}
      size="base"
      className="group"
      textClassName="font-medium group-hover:text-link"
    />
  )

  return (
    <div className="flex items-start justify-between">
      {providerItem.website ? (
        <a
          href={providerItem.website}
          className="flex items-center gap-2"
          target="_blank"
          rel="noreferrer"
        >
          {icon}
        </a>
      ) : (
        // The custom-endpoint protocols have no product page to open.
        <span className="flex items-center gap-2">{icon}</span>
      )}
    </div>
  )
}
