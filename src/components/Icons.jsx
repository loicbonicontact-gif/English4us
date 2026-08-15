// Jeu d'icônes SVG maison — jamais d'emoji.
// Un emoji change de dessin selon l'appareil, ne se colore pas et ne s'anime pas.
// Toutes les icônes partagent la même grille 24x24 et la même épaisseur de trait (2px),
// condition pour que l'ensemble paraisse cohérent.

const base = {
  width: 24,
  height: 24,
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 2,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
  'aria-hidden': true,
  focusable: false
}

export function IconFlame({ size = 24, ...rest }) {
  return (
    <svg {...base} width={size} height={size} {...rest}>
      <path d="M12 22c4.4 0 7-2.8 7-6.6 0-4.5-3.6-6.6-4.6-10.4-2 1.3-2.6 3.4-2.2 5.3-1.2-.6-1.8-1.9-1.9-3.3C8.2 8.4 5 10.9 5 15.4 5 19.2 7.6 22 12 22z" />
    </svg>
  )
}

export function IconBolt({ size = 24, ...rest }) {
  return (
    <svg {...base} width={size} height={size} {...rest}>
      <path d="M13 2 4.5 13.5H11l-1 8.5 8.5-11.5H12l1-8.5z" />
    </svg>
  )
}

export function IconHeart({ size = 24, ...rest }) {
  return (
    <svg {...base} width={size} height={size} {...rest}>
      <path d="M12 20.5s-7.5-4.6-7.5-10A4.5 4.5 0 0 1 12 7.6a4.5 4.5 0 0 1 7.5 2.9c0 5.4-7.5 10-7.5 10z" />
    </svg>
  )
}

export function IconCap({ size = 24, ...rest }) {
  return (
    <svg {...base} width={size} height={size} {...rest}>
      <path d="M2 9l10-5 10 5-10 5-10-5z" />
      <path d="M6 11.5V16c0 1.7 2.7 3 6 3s6-1.3 6-3v-4.5" />
    </svg>
  )
}

export function IconLock({ size = 24, ...rest }) {
  return (
    <svg {...base} width={size} height={size} {...rest}>
      <rect x="4.5" y="10.5" width="15" height="10" rx="2.5" />
      <path d="M8 10.5V7.5a4 4 0 0 1 8 0v3" />
    </svg>
  )
}

export function IconPlay({ size = 24, ...rest }) {
  return (
    <svg {...base} width={size} height={size} fill="currentColor" stroke="none" {...rest}>
      <path d="M8.5 5.6a1 1 0 0 1 1.53-.85l8 6.4a1 1 0 0 1 0 1.7l-8 6.4a1 1 0 0 1-1.53-.85V5.6z" />
    </svg>
  )
}

export function IconCheck({ size = 24, ...rest }) {
  return (
    <svg {...base} width={size} height={size} strokeWidth={3} {...rest}>
      <path d="M4.5 12.8 9.5 17.5 19.5 6.5" />
    </svg>
  )
}

export function IconTrophy({ size = 24, ...rest }) {
  return (
    <svg {...base} width={size} height={size} {...rest}>
      <path d="M7 4h10v5a5 5 0 0 1-10 0V4z" />
      <path d="M7 6H4.5v1.5A3.5 3.5 0 0 0 7 11M17 6h2.5v1.5A3.5 3.5 0 0 1 17 11" />
      <path d="M12 14v3.5M9 20.5h6" />
    </svg>
  )
}

export function IconPath({ size = 24, ...rest }) {
  return (
    <svg {...base} width={size} height={size} {...rest}>
      <path d="M6 20V9a3 3 0 0 1 3-3h6a3 3 0 0 0 3-3" />
      <circle cx="6" cy="20" r="1.6" fill="currentColor" stroke="none" />
      <circle cx="18" cy="3.5" r="1.6" fill="currentColor" stroke="none" />
    </svg>
  )
}

export function IconLogout({ size = 24, ...rest }) {
  return (
    <svg {...base} width={size} height={size} {...rest}>
      <path d="M14 20H6.5A2.5 2.5 0 0 1 4 17.5v-11A2.5 2.5 0 0 1 6.5 4H14" />
      <path d="M17 15.5 20.5 12 17 8.5M20 12H10" />
    </svg>
  )
}

export function IconClose({ size = 24, ...rest }) {
  return (
    <svg {...base} width={size} height={size} {...rest}>
      <path d="M6 6l12 12M18 6L6 18" />
    </svg>
  )
}

export function IconSoundOn({ size = 24, ...rest }) {
  return (
    <svg {...base} width={size} height={size} {...rest}>
      <path d="M4 9.5h3.5L12 5.5v13L7.5 14.5H4z" />
      <path d="M16 9.2a4 4 0 0 1 0 5.6M18.6 6.6a7.6 7.6 0 0 1 0 10.8" />
    </svg>
  )
}

export function IconSoundOff({ size = 24, ...rest }) {
  return (
    <svg {...base} width={size} height={size} {...rest}>
      <path d="M4 9.5h3.5L12 5.5v13L7.5 14.5H4z" />
      <path d="M16.5 9.5l5 5M21.5 9.5l-5 5" />
    </svg>
  )
}
