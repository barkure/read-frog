// @vitest-environment jsdom

import { act, fireEvent, render, screen, waitFor } from "@testing-library/react"
import { beforeEach, describe, expect, it, vi } from "vitest"
import { DEFAULT_PROVIDER_CONFIG } from "@/utils/constants/providers"
import { ConnectionTestButton } from "../connection-button"

const mutationMock = vi.hoisted(() => ({
  isPending: false,
  mutate: vi.fn<(...args: any[]) => any>(),
  reset: vi.fn<() => void>(),
}))

vi.mock("@tanstack/react-query", () => ({
  useMutation: () => mutationMock,
}))

vi.mock("@/utils/config/api", () => ({
  getObjectWithoutAPIKeys: () => ({}),
}))

vi.mock("@/utils/host/translate/execute-translate", () => ({
  executeTranslate: vi.fn<(...args: any[]) => any>(),
}))

describe("ConnectionTestButton", () => {
  beforeEach(() => {
    mutationMock.mutate.mockReset()
    mutationMock.reset.mockReset()
  })

  it("clears successful feedback when the endpoint changes", async () => {
    const providerConfig = {
      ...DEFAULT_PROVIDER_CONFIG.deepseek,
      apiKey: "test-key",
    }
    const { rerender } = render(<ConnectionTestButton providerConfig={providerConfig} />)

    fireEvent.click(
      screen.getByRole("button", {
        name: "options.apiProviders.testConnection.button",
      }),
    )
    const [variables, callbacks] = mutationMock.mutate.mock.calls.at(-1)!
    act(() => {
      void callbacks.onSuccess(undefined, variables)
    })

    expect(
      screen.getByRole("button", {
        name: "options.apiProviders.testConnection.success",
      }),
    ).toBeInTheDocument()

    rerender(
      <ConnectionTestButton
        providerConfig={{
          ...providerConfig,
          baseURL: "https://gateway.example.com/v2",
        }}
      />,
    )

    expect(
      screen.getByRole("button", {
        name: "options.apiProviders.testConnection.button",
      }),
    ).toBeInTheDocument()
  })

  it("ignores a result from the previous endpoint", async () => {
    const providerConfig = {
      ...DEFAULT_PROVIDER_CONFIG.deepseek,
      apiKey: "test-key",
    }
    const { rerender } = render(<ConnectionTestButton providerConfig={providerConfig} />)

    await waitFor(() => expect(mutationMock.reset).toHaveBeenCalled())
    const initialResetCount = mutationMock.reset.mock.calls.length
    fireEvent.click(
      screen.getByRole("button", {
        name: "options.apiProviders.testConnection.button",
      }),
    )
    const [variables, callbacks] = mutationMock.mutate.mock.calls.at(-1)!

    rerender(
      <ConnectionTestButton
        providerConfig={{
          ...providerConfig,
          baseURL: "https://gateway.example.com/v2",
        }}
      />,
    )
    await waitFor(() => expect(mutationMock.reset).toHaveBeenCalledTimes(initialResetCount + 1))

    act(() => {
      void callbacks.onSuccess(undefined, variables)
    })

    expect(
      screen.getByRole("button", {
        name: "options.apiProviders.testConnection.button",
      }),
    ).toBeInTheDocument()
  })
})
