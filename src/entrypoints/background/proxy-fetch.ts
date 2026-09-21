import type { ProxyResponse } from "@/types/proxy-fetch"
import { logger } from "@/utils/logger"
import { onMessage } from "@/utils/message"

function encodeArrayBufferToBase64(buffer: ArrayBuffer) {
  const bytes = new Uint8Array(buffer)
  let binary = ""
  const chunkSize = 0x8000

  for (let index = 0; index < bytes.length; index += chunkSize) {
    const chunk = bytes.subarray(index, index + chunkSize)
    binary += String.fromCharCode(...chunk)
  }

  return btoa(binary)
}

/**
 * Proxies cross-origin fetches for content scripts. Site CSP can block a
 * content script's own fetch — icon glyphs and provider logos are exactly the
 * kind of remote asset that gets blocked — so those requests run here instead,
 * where the extension's host permissions apply.
 */
export function proxyFetch() {
  onMessage("backgroundFetch", async (message): Promise<ProxyResponse> => {
    const {
      url,
      method,
      headers,
      body,
      credentials,
      redirect,
      responseType = "text",
    } = message.data

    const response = await fetch(url, {
      method: (method ?? "GET").toUpperCase(),
      headers: headers ? new Headers(headers) : undefined,
      body,
      credentials: credentials ?? "include",
      redirect,
    })

    const responseBody =
      responseType === "base64"
        ? encodeArrayBufferToBase64(await response.arrayBuffer())
        : await response.text()

    logger.info("[ProxyFetch] Proxied fetch:", { url, status: response.status })

    return {
      status: response.status,
      statusText: response.statusText,
      headers: [...response.headers.entries()],
      body: responseBody,
      bodyEncoding: responseType,
    }
  })
}
