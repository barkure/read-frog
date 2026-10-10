// @vitest-environment jsdom
import { describe, expect, it, vi } from "vitest"
import { isLexicalElement, replaceLexical } from "./lexical"

function fakeEditor(element: HTMLElement, root: object | undefined) {
  const update = vi.fn<(callback: () => void) => void>((callback) => {
    callback()
  })
  const editor = {
    getRootElement: () => element,
    getEditorState: () => ({ _nodeMap: new Map(root ? [["root", root]] : []) }),
    update,
  }
  Object.assign(element, { __lexicalEditor: editor })
  return { editor, update }
}

describe("lexical input replacement", () => {
  it("replaces the page editor contents through its own selection API", () => {
    const element = document.createElement("div")
    element.setAttribute("data-lexical-editor", "true")
    element.contentEditable = "true"
    const insertRawText = vi.fn<(text: string) => void>()
    const root = {
      getChildrenSize: () => 2,
      select: vi.fn<
        (anchorOffset: number, focusOffset: number) => { insertRawText: typeof insertRawText }
      >(() => ({ insertRawText })),
    }
    const { update } = fakeEditor(element, root)

    expect(isLexicalElement(element)).toBe(true)
    expect(replaceLexical(element, "translated\nline")).toBe(true)
    expect(root.select).toHaveBeenCalledWith(0, 2)
    expect(insertRawText).toHaveBeenCalledWith("translated\nline")
    expect(update).toHaveBeenCalledWith(expect.any(Function), {
      tag: "history-push",
      discrete: true,
    })
  })

  it("does not claim a lexical editor that belongs to another element", () => {
    const element = document.createElement("div")
    const other = document.createElement("div")
    fakeEditor(other, { getChildrenSize: () => 0, select: () => ({ insertRawText() {} }) })
    Object.assign(element, {
      __lexicalEditor: (other as HTMLElement & { __lexicalEditor?: unknown }).__lexicalEditor,
    })

    expect(replaceLexical(element, "nope")).toBe(false)
  })
})
