import type { AutosaveController } from "@/components/form/autosave-controller"
import type { APIProviderConfig } from "@/types/config/provider"
import { useAutosave } from "@/components/form/use-autosave"
import { APIKeyField } from "./provider-config-form/api-key-field"
import { ConfigHeader } from "./provider-config-form/config-header"
import { formOpts, useAppForm } from "./provider-config-form/form"
import { ProviderURLField } from "./provider-config-form/provider-url-field"
import { TranslateModelSelector } from "./provider-config-form/translate-model-selector"

export function useProviderForm(
  providerConfig: APIProviderConfig,
  save: (providerConfig: APIProviderConfig, changes: Partial<APIProviderConfig>) => Promise<void>,
) {
  const form = useAppForm({
    ...formOpts,
    defaultValues: providerConfig,
    onSubmitMeta: { revision: 0 },
    onSubmit: async ({ value, meta }) => {
      await autosave.commit(value, meta.revision)
    },
  })
  const autosave: AutosaveController<APIProviderConfig> = useAutosave({
    initialValue: providerConfig,
    getDraft: () => form.state.values,
    setField: (key, value) =>
      form.setFieldValue(key, value as never, { dontUpdateMeta: true, dontRunListeners: true }),
    reset: (value) => form.reset(value),
    submit: (revision) => form.handleSubmit({ revision }),
    persist: save,
  })
  return { form, autosave }
}

/**
 * The settings for one API provider.
 *
 * Every field here is one DeepSeek expects: the key, the endpoint and the model. Sampling is
 * deliberately not configurable — the extension runs on DeepSeek's own defaults. The identity
 * fields (name, description) and the per-provider assignment panel are gone with the
 * multi-provider catalog: the name is the provider's own, and features pick their provider on
 * their own page.
 */
export function ProviderEditorForm({
  form,
  providerConfig,
}: {
  form: ReturnType<typeof useProviderForm>["form"]
  providerConfig: APIProviderConfig
}) {
  return (
    <form.AppForm>
      <div className="flex flex-col gap-4">
        <ConfigHeader providerType={providerConfig.provider} />
        <APIKeyField form={form} />
        <TranslateModelSelector form={form} />
        <ProviderURLField form={form} />
      </div>
    </form.AppForm>
  )
}
