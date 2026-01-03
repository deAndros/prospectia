import { Users, Globe } from 'lucide-react'

export const getSocialStyle = (network) => {
  const n = network.toLowerCase()
  if (n.includes('linkedin'))
    return {
      Icon: Users,
      color: 'text-[#0077b5]',
      bg: 'bg-[#0077b5]/10',
      border: 'border-[#0077b5]/20',
      hover: 'hover:border-[#0077b5]/50 hover:bg-[#0077b5]/20',
    }
  if (n.includes('twitter') || n.includes('x'))
    return {
      Icon: Users,
      color: 'text-white',
      bg: 'bg-white/5',
      border: 'border-white/10',
      hover: 'hover:border-white/30 hover:bg-white/10',
    }
  if (n.includes('instagram'))
    return {
      Icon: Users,
      color: 'text-pink-500',
      bg: 'bg-pink-500/10',
      border: 'border-pink-500/20',
      hover: 'hover:border-pink-500/50 hover:bg-pink-500/20',
    }
  if (n.includes('facebook'))
    return {
      Icon: Users,
      color: 'text-[#1877f2]',
      bg: 'bg-[#1877f2]/10',
      border: 'border-[#1877f2]/20',
      hover: 'hover:border-[#1877f2]/50 hover:bg-[#1877f2]/20',
    }
  return {
    Icon: Globe,
    color: 'text-indigo-400',
    bg: 'bg-indigo-500/10',
    border: 'border-indigo-500/20',
    hover: 'hover:border-indigo-500/50 hover:bg-indigo-500/20',
  }
}

export const getScoreTone = (score100) => {
  const s = Number(score100) || 0
  if (s >= 80)
    return {
      label: 'Potencial alto',
      badge: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
      glow: 'bg-emerald-500',
      text: 'text-emerald-300',
    }
  if (s >= 60)
    return {
      label: 'Potencial medio',
      badge: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
      glow: 'bg-blue-500',
      text: 'text-blue-300',
    }
  if (s >= 40)
    return {
      label: 'Potencial bajo',
      badge: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
      glow: 'bg-amber-500',
      text: 'text-amber-300',
    }
  return {
    label: 'Potencial muy bajo',
    badge: 'bg-zinc-500/10 text-zinc-400 border-zinc-500/20',
    glow: 'bg-zinc-500',
    text: 'text-zinc-300',
  }
}

export const getRecommendationTone = (rec) => {
  if (rec === 'Contacto prioritario')
    return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
  if (rec === 'Revisar')
    return 'bg-amber-500/10 text-amber-400 border-amber-500/20'
  if (rec === 'Descartar')
    return 'bg-zinc-500/10 text-zinc-400 border-zinc-500/20'
  return 'bg-white/5 text-zinc-300 border-white/10'
}

