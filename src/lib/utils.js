import clsx from 'clsx'

export function cn(...inputs) {
  return clsx(inputs)
}

export async function copyToClipboard(text) {
  if (!navigator.clipboard) return false
  try {
    await navigator.clipboard.writeText(text)
    return true
  } catch {
    return false
  }
}

/** Height of the fixed header, which differs between mobile and desktop. */
function headerOffset() {
  const raw = getComputedStyle(document.documentElement).getPropertyValue('--nav-h')
  const px = parseFloat(raw) * (raw.includes('rem') ? 16 : 1)
  return (Number.isFinite(px) ? px : 80) + 16
}

export function scrollToId(id) {
  if (id === 'top') {
    window.scrollTo({ top: 0, behavior: 'smooth' })
    return
  }
  const el = document.getElementById(id)
  if (!el) return
  const top = el.getBoundingClientRect().top + window.scrollY - headerOffset()
  window.scrollTo({ top, behavior: 'smooth' })
}
