export const isVisible = (el: Element) => {
  const style = window.getComputedStyle(el)
  if (style.display === "none" || style.visibility === "hidden" || Number(style.opacity) === 0) return false
  const rect = (el as HTMLElement).getBoundingClientRect()
  return rect.width > 0 && rect.height > 0
}

export const getSelectorHint = (el: Element) => {
  const id = (el as HTMLElement).id
  if (id) return `#${id}`
  const classes = Array.from((el as HTMLElement).classList).slice(0, 2).join(".")
  return `${el.tagName.toLowerCase()}${classes ? `.${classes}` : ""}`
}

export const pageKey = () => `${location.origin}${location.pathname}`
