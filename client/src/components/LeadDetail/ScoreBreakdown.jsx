import clsx from 'clsx'
import { Target } from 'lucide-react'
import { getScoreTone, getRecommendationTone } from './helpers'

const SCORE_ITEMS = [
  { key: 'engagement', label: 'Engagement' },
  { key: 'vertical_affinity', label: 'Afinidad vertical' },
  { key: 'elearning_interest', label: 'Interés e-learning' },
  { key: 'innovation_signals', label: 'Señales de innovación' },
]

const ScoreBreakdown = ({ scoring, enrichment }) => {
  if (!scoring || typeof scoring.score !== 'number') return null

  return (
    <div className="mb-8 border-t border-white/5 pt-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-widest flex items-center gap-2 mb-4">
        <Target size={14} /> Análisis de Prioridad
      </h3>

      <div className="bg-zinc-800/40 p-6 rounded-2xl border border-white/5 relative overflow-hidden">
        <div
          className={clsx(
            'absolute top-0 right-0 w-64 h-64 blur-3xl rounded-full opacity-10 pointer-events-none -translate-y-1/2 translate-x-1/2',
            getScoreTone(scoring.score).glow
          )}
        ></div>

        <div className="flex items-start justify-between mb-6 relative z-10">
          <div>
            <div className="text-4xl font-black text-white leading-none mb-1 flex items-baseline gap-2">
              {scoring.score}
              <span className="text-sm font-medium text-zinc-400 font-sans tracking-normal">
                / 100
              </span>
            </div>
            <div
              className={clsx(
                'inline-flex px-2 py-0.5 rounded text-xs font-bold uppercase tracking-wide border',
                getScoreTone(scoring.score).badge
              )}
            >
              {getScoreTone(scoring.score).label}
            </div>
          </div>
          {enrichment?.final_recommendation && (
            <div
              className={clsx(
                'inline-flex px-2 py-1 rounded-lg text-xs font-bold uppercase tracking-wide border',
                getRecommendationTone(enrichment.final_recommendation)
              )}
              title="Recomendación final"
            >
              {enrichment.final_recommendation}
            </div>
          )}
        </div>

        {enrichment?.analysis_summary && (
          <p className="text-zinc-300 text-sm leading-relaxed relative z-10 mb-5">
            {enrichment.analysis_summary}
          </p>
        )}

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 relative z-10">
          {SCORE_ITEMS.map((item) => {
            const value = enrichment?.scores?.[item.key]
            const v10 = Math.max(0, Math.min(10, Number(value) || 0))
            const tone = getScoreTone(v10 * 10)
            return (
              <div
                key={item.key}
                className="bg-black/30 p-3 rounded-xl border border-white/5"
              >
                <div className="text-[10px] text-zinc-500 uppercase font-bold mb-1">
                  {item.label}
                </div>
                <div className="flex items-baseline gap-2">
                  <div className={clsx('text-white font-black text-2xl', tone.text)}>
                    {v10}
                  </div>
                  <div className="text-xs text-zinc-500 font-semibold">/ 10</div>
                </div>
              </div>
            )
          })}
        </div>

        {Array.isArray(enrichment?.detected_verticals) &&
          enrichment.detected_verticals.length > 0 && (
            <div className="mt-5 space-y-3 relative z-10">
              <div>
                <div className="text-xs uppercase tracking-widest text-zinc-500 font-bold mb-2">
                  Verticales detectadas
                </div>
                <div className="flex flex-wrap gap-2">
                  {enrichment.detected_verticals.slice(0, 12).map((v, idx) => (
                    <span
                      key={`${v}-${idx}`}
                      className="px-2.5 py-1 bg-indigo-500/10 border border-indigo-500/20 rounded-md text-xs text-indigo-200"
                    >
                      {v}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}
      </div>
    </div>
  )
}

export default ScoreBreakdown

