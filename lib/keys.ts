/** Keyboard shortcut labels that match the visitor's platform */

export const isMac = () =>
  typeof navigator !== 'undefined' && /Mac|iPhone|iPad/.test(navigator.platform)

export const BACKSLASH = String.fromCharCode(92)

export const modKey = () => (isMac() ? '⌘' : 'Ctrl')
export const altKey = () => (isMac() ? '⌥' : 'Alt')
export const shiftKey = () => (isMac() ? '⇧' : 'Shift')

/** e.g. shortcut('mod', 'K') -> "Ctrl+K" or "⌘K" */
export const shortcut = (...keys: string[]) => {
  const names = keys.map((key) =>
    key === 'mod' ? modKey() : key === 'alt' ? altKey() : key === 'shift' ? shiftKey() : key
  )
  return names.join(isMac() ? '' : '+')
}
