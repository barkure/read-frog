import type { APIProviderConfig } from "@/types/config/provider"
import { dequal } from "dequal"
import { useAtomValue, useSetAtom } from "jotai"
import { useEffect, useState } from "react"
import { AutosaveBoundary } from "@/components/form/autosave-navigation"
import { toAutosaveSession } from "@/components/form/use-autosave"
import { isAPIProviderConfig } from "@/types/config/provider"
import { configFieldsAtomMap } from "@/utils/atoms/config"
import { patchProviderConfigAtom } from "@/utils/atoms/entity-config"
import { providerConfigAtom } from "@/utils/atoms/provider"
import { getAPIProvidersConfig } from "@/utils/config/helpers"
import { ProviderEditorForm, useProviderForm } from "../provider-editor"

/** DeepSeek's settings. The one API provider this build ships, so there is nothing to select. */
export function ProviderConfigForm() {
  const providersConfig = useAtomValue(configFieldsAtomMap.providersConfig)
  const providerConfig = getAPIProvidersConfig(providersConfig)[0]

  // Held across a config reload so the form does not unmount and lose an edit in progress.
  const [lastProvider, setLastProvider] = useState<APIProviderConfig | undefined>(undefined)
  if (providerConfig && !dequal(providerConfig, lastProvider)) {
    setLastProvider(providerConfig)
  }

  const editorProvider = providerConfig ?? lastProvider
  if (!editorProvider) {
    return null
  }

  return <EditableProviderConfig key={editorProvider.id} providerConfig={editorProvider} />
}

function EditableProviderConfig({ providerConfig }: { providerConfig: APIProviderConfig }) {
  const currentProviderConfig = useAtomValue(providerConfigAtom(providerConfig.id))
  const patchProvider = useSetAtom(patchProviderConfigAtom)
  const { form, autosave } = useProviderForm(providerConfig, async (_snapshot, changes) => {
    await patchProvider({ id: providerConfig.id, changes })
  })

  useEffect(() => {
    autosave.reconcile(
      currentProviderConfig && isAPIProviderConfig(currentProviderConfig)
        ? currentProviderConfig
        : undefined,
    )
  }, [currentProviderConfig, autosave])

  return (
    <AutosaveBoundary session={toAutosaveSession(autosave)}>
      <ProviderEditorForm form={form} providerConfig={providerConfig} />
    </AutosaveBoundary>
  )
}
