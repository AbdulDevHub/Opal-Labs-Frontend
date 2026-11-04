/** Page cover presets. A cover that starts with http is treated as an image link instead */
export const COVERS: { id: string; name: string; background: string }[] = [
  {
    id: 'aurora',
    name: 'Aurora',
    background:
      'radial-gradient(at 20% 30%, #54D8B3 0, transparent 55%), radial-gradient(at 80% 20%, #7CC8FF 0, transparent 50%), radial-gradient(at 60% 90%, #A78BFA 0, transparent 55%), #0F172A',
  },
  { id: 'mint', name: 'Mint', background: 'linear-gradient(120deg, #54D8B3 0%, #B4F1DE 100%)' },
  { id: 'ocean', name: 'Ocean', background: 'linear-gradient(120deg, #2563EB 0%, #22D3EE 100%)' },
  {
    id: 'sunset',
    name: 'Sunset',
    background: 'linear-gradient(120deg, #F97316 0%, #EC4899 60%, #8B5CF6 100%)',
  },
  {
    id: 'lavender',
    name: 'Lavender',
    background: 'linear-gradient(120deg, #C4B5FD 0%, #F0ABFC 100%)',
  },
  { id: 'forest', name: 'Forest', background: 'linear-gradient(120deg, #065F46 0%, #84CC16 100%)' },
  { id: 'peach', name: 'Peach', background: 'linear-gradient(120deg, #FDBA74 0%, #FDE68A 100%)' },
  {
    id: 'midnight',
    name: 'Midnight',
    background: 'linear-gradient(120deg, #0F172A 0%, #312E81 60%, #1E1B4B 100%)',
  },
]

export const coverBackground = (cover?: string) => {
  if (!cover) return undefined
  if (/^https?:\/\//.test(cover))
    return `center / cover no-repeat url("${cover.replace(/"/g, '')}")`
  return COVERS.find((preset) => preset.id === cover)?.background ?? COVERS[0].background
}

export const randomCover = () => COVERS[Math.floor(Math.random() * COVERS.length)].id
