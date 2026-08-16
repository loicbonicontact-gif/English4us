// Icones de l'application — Lucide, trait 1,75 px.
//
// Pourquoi Lucide plutot que les SVG maison precedents : un seul jeu coherent,
// des formes reconnues, et la maintenance ne repose plus sur des chemins
// dessines a la main. Le trait est fixe ici une fois pour toutes, pour que
// deux icones cote a cote n'aient jamais des epaisseurs differentes.
//
// Les noms `IconXxx` sont conserves pour ne pas casser les composants
// existants pendant la refonte ecran par ecran.

import {
  Check,
  ChevronRight,
  Flame,
  Heart,
  GraduationCap,
  History,
  Lock,
  LogOut,
  Play,
  RotateCw,
  Route,
  Trophy,
  User,
  Volume2,
  VolumeX,
  X,
  Zap
} from 'lucide-react'

const STROKE = 1.75

// Enrobe une icone Lucide : impose le trait et accepte `size` comme avant.
function wrap(Component) {
  return function Icon({ size = 24, strokeWidth = STROKE, ...rest }) {
    return <Component size={size} strokeWidth={strokeWidth} aria-hidden="true" {...rest} />
  }
}

export const IconCheck = wrap(Check)
export const IconChevron = wrap(ChevronRight)
export const IconRedo = wrap(RotateCw)
export const IconFlame = wrap(Flame)
export const IconHeart = wrap(Heart)
export const IconCap = wrap(GraduationCap)
export const IconReview = wrap(History)
export const IconLock = wrap(Lock)
export const IconLogout = wrap(LogOut)
export const IconPlay = wrap(Play)
export const IconPath = wrap(Route)
export const IconTrophy = wrap(Trophy)
export const IconUser = wrap(User)
export const IconSoundOn = wrap(Volume2)
export const IconSoundOff = wrap(VolumeX)
export const IconClose = wrap(X)
export const IconBolt = wrap(Zap)
