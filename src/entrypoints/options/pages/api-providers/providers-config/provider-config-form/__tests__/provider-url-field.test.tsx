// @vitest-environment jsdom

import type { APIProviderConfig } from "@/types/config/provider"
import { render, screen } from "@testing-library/react"
import { describe, expect, it } from "vitest"
import { AutosaveContext, toAutosaveSession } from "@/components/form/use-autosave"
import { DEFAULT_PROVIDER_CONFIG } from "@/utils/constants/providers"
import { useProviderForm } from "../../provider-editor"
import { ProviderURLField } from "../provider-url-field"

function ProviderURLFieldHarness({ providerConfig }: { providerConfig: APIProviderConfig }) {
  const { form, autosave } = useProviderForm(providerConfig, async () => {})

  return (
    <AutosaveContext value={toAutosaveSession(autosave)}>
      <ProviderURLField form={form} />
    </AutosaveContext>
  )
}

describe("ProviderURLField", () => {
  it("renders an optional Base URL for DeepSeek", () => {
    render(<ProviderURLFieldHarness providerConfig={DEFAULT_PROVIDER_CONFIG.deepseek} />)

    expect(
      screen.getByText(
        "options.apiProviders.form.fields.baseURL (options.apiProviders.form.fields.optional)",
      ),
    ).toBeInTheDocument()
    expect(screen.getByRole("textbox")).toHaveAttribute("id", "baseURL")
    expect(screen.getByRole("textbox")).toHaveAttribute("placeholder", "https://api.deepseek.com")
  })
})
