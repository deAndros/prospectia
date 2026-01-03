import { Target } from 'lucide-react'

const SignalsList = ({ signals }) => (
  <div className="space-y-4">
    <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-widest flex items-center gap-2 mb-4">
      <Target size={14} /> Señales de Interés
    </h3>
    {signals && signals.length > 0 ? (
      <div className="flex flex-wrap gap-2">
        {signals.map((signal, index) => (
          <div
            key={index}
            className="px-3 py-2 bg-emerald-500/5 text-emerald-400/90 border border-emerald-500/10 rounded-lg text-sm font-medium leading-relaxed hover:bg-emerald-500/10 hover:border-emerald-500/20 transition-colors cursor-default"
          >
            {signal}
          </div>
        ))}
      </div>
    ) : (
      <p className="text-zinc-600 text-sm italic pl-2">
        No se detectaron señales específicas.
      </p>
    )}
  </div>
)

export default SignalsList

