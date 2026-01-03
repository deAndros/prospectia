import { Globe, ExternalLink } from 'lucide-react'
import { getSocialStyle } from './helpers'

const SocialMediaList = ({ socialMedia }) => (
  <div className="space-y-4">
    <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-widest flex items-center gap-2 mb-4">
      <Globe size={14} /> Redes
    </h3>
    {socialMedia && socialMedia.length > 0 ? (
      <div className="flex flex-col gap-2">
        {socialMedia.map((social, idx) => {
          const style = getSocialStyle(social.network)
          const Icon = style.Icon
          return (
            <a
              key={idx}
              href={social.url}
              target="_blank"
              rel="noopener noreferrer"
              className={`flex items-center justify-between p-3 rounded-xl border transition-all group ${style.bg} ${style.border} ${style.hover}`}
            >
              <div className="flex items-center gap-4">
                <span
                  className={`${style.color} group-hover:scale-110 transition-transform`}
                >
                  <Icon size={18} />
                </span>
                <span className="font-bold text-sm text-white capitalizetracking-wide">
                  {social.network}
                </span>
              </div>
              <div className="flex items-center gap-3">
                {social.followers && (
                  <span className="text-xs font-mono text-zinc-300 bg-black/40 px-2.5 py-1 rounded-md border border-white/5 group-hover:border-white/10 transition-colors">
                    {social.followers}
                  </span>
                )}
                <ExternalLink
                  size={14}
                  className={`opacity-0 group-hover:opacity-100 transition-all ${style.color}`}
                />
              </div>
            </a>
          )
        })}
      </div>
    ) : (
      <p className="text-zinc-600 text-sm italic pl-2">
        No hay redes sociales registradas.
      </p>
    )}
  </div>
)

export default SocialMediaList

