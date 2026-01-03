import { MapPin, Briefcase, ExternalLink } from 'lucide-react'

const LeadSummary = ({ lead }) => (
  <div>
    <h2 className="text-3xl font-bold text-white mb-4 leading-tight tracking-tight drop-shadow-lg">
      {lead.name}
    </h2>

    <div className="flex flex-wrap items-center gap-3">
      <span className="px-3 py-1.5 rounded-lg text-sm font-semibold bg-white/10 text-white backdrop-blur-md border border-white/10">
        {lead.type}
      </span>
      <div className="h-6 w-px bg-white/10 mx-1"></div>
      <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium text-zinc-300">
        <MapPin size={16} className="text-zinc-500" />
        {lead.country}
      </div>
      <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium text-zinc-300">
        <Briefcase size={16} className="text-zinc-500" />
        {lead.niche}
      </div>
    </div>

    <div className="mt-8">
      <a
        href={lead.url}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-indigo-500 text-white px-8 py-3 rounded-xl font-bold text-sm tracking-wide hover:from-indigo-500 hover:to-indigo-400 transition-all shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 hover:-translate-y-0.5"
      >
        <ExternalLink size={18} />
        Visitar Sitio Web
      </a>
    </div>
  </div>
)

export default LeadSummary

