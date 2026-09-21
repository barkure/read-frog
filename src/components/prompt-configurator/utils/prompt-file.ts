import type { TranslatePromptObj } from "@/types/config/translate"
import { saveAs } from "file-saver"
import { z } from "zod"
import { translatePromptObjSchema } from "@/types/config/translate"
import { APP_NAME } from "@/utils/constants/app"

export type PromptConfig = Omit<TranslatePromptObj, "id">
export type PromptConfigList = PromptConfig[]

const PROMPTS_FILE = `${APP_NAME}_prompts`

const promptFileSchema = z.array(translatePromptObjSchema.omit({ id: true }))

export function checkPromptConfig(list: unknown): list is PromptConfigList {
  return promptFileSchema.safeParse(list).success
}

export function downloadJSONFile(data: object) {
  const json = JSON.stringify(data, null, 2)
  const blob = new Blob([json], { type: "text/json" })
  saveAs(blob, `${PROMPTS_FILE}.json`)
}

export function analysisJSONFile(file: File): Promise<PromptConfigList> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.readAsText(file)
    reader.onload = (e) => {
      try {
        const fileResult = e.target?.result ?? "[]"
        if (typeof fileResult === "string") {
          const list = JSON.parse(fileResult)
          const checked = checkPromptConfig(list)
          if (checked) {
            resolve(list)
          } else {
            reject(new Error("Prompt config is invalid"))
          }
        } else {
          reject(new Error("Prompt config is invalid"))
        }
      } catch (readError) {
        reject(readError)
      }
    }
    reader.onerror = (error) => reject(error)
  })
}
