import type { APIProviderConfig } from "@/types/config/provider"
import { useSelector } from "@tanstack/react-store"
import { useAutosaveContext } from "@/components/form/use-autosave"
import { Checkbox } from "@/components/ui/base-ui/checkbox"
import {
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/base-ui/select"
import { isLLMProviderConfig, LLM_PROVIDER_MODELS } from "@/types/config/provider"
import { i18n } from "@/utils/i18n"
import { withForm } from "./form"

export const TranslateModelSelector = withForm({
  ...{ defaultValues: {} as APIProviderConfig },
  render: function Render({ form }) {
    const providerConfig = useSelector(form.store, (state) => state.values)
    const autosave = useAutosaveContext()
    if (!isLLMProviderConfig(providerConfig)) return null

    const { isCustomModel, customModel, model } = providerConfig.model

    return (
      <div>
        {isCustomModel ? (
          <form.AppField name="model.customModel">
            {(field) => (
              <field.InputFieldAutoSave
                label={i18n.t("options.apiProviders.form.models.label")}
                value={customModel ?? ""}
              />
            )}
          </form.AppField>
        ) : (
          <form.AppField name="model.model">
            {(field) => (
              <field.SelectFieldAutoSave label={i18n.t("options.apiProviders.form.models.label")}>
                <SelectTrigger className="w-full">
                  <SelectValue
                    placeholder={i18n.t("options.apiProviders.form.models.translate.placeholder")}
                  />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {LLM_PROVIDER_MODELS[providerConfig.provider].map((modelOption) => (
                      <SelectItem key={modelOption} value={modelOption}>
                        {modelOption}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </field.SelectFieldAutoSave>
            )}
          </form.AppField>
        )}
        {
          <form.Field name="model.isCustomModel">
            {(field) => (
              <div className="mt-2.5 flex items-center space-x-2">
                <Checkbox
                  id="isCustomModel-translate"
                  checked={field.state.value}
                  onCheckedChange={(checked) => {
                    autosave.edit(
                      () => {
                        form.setFieldValue("model.isCustomModel", checked)
                        form.setFieldValue("model.customModel", checked ? model : null)
                      },
                      { immediate: true },
                    )
                  }}
                />
                <label
                  htmlFor="isCustomModel-translate"
                  className="cursor-pointer text-sm leading-none font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  {i18n.t("options.apiProviders.form.models.enterCustomModel")}
                </label>
              </div>
            )}
          </form.Field>
        }
      </div>
    )
  },
})
