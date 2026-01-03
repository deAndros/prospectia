import { Search, Trash2, Loader2, Calculator } from 'lucide-react'
import clsx from 'clsx'

const getScoreTone = (score) => {
    const s = Number(score) || 0;
    if (s >= 80) return { bucket: 'A', cls: "bg-emerald-500 border-emerald-400 shadow-emerald-500/30", label: 'Alto' };
    if (s >= 60) return { bucket: 'B', cls: "bg-blue-500 border-blue-400 shadow-blue-500/30", label: 'Medio' };
    return { bucket: 'Nurture', cls: "bg-zinc-600 border-zinc-500", label: 'Bajo' };
};

const ProspectTableRow = ({ lead, onSelectLead, onRemove, onAnalyze, analyzingId }) => {
    return (
        <tr
            className="group/row bg-white/[0.03] backdrop-blur-sm border border-white/5 hover:bg-white/[0.07] transition-all cursor-pointer rounded-2xl"
            onClick={() => onSelectLead(lead)}
        >
            <td className="px-6 py-4 first:rounded-l-2xl border-y border-l border-white/5 group-hover/row:border-white/10">
                <div className="flex items-center gap-4">
                    <div
                        className="w-5 h-5 rounded border-2 border-zinc-800 flex items-center justify-center group-hover/row:border-indigo-500/50 transition-colors"
                        onClick={(e) => e.stopPropagation()}
                    ></div>
                    <div className="flex items-center gap-3 min-w-0 max-w-[180px]">
                        <div className="w-10 h-10 rounded-full bg-zinc-800 border-2 border-white/5 flex items-center justify-center overflow-hidden shadow-inner shrink-0">
                            {lead.avatar ? (
                                <img src={lead.avatar} alt="" className="w-full h-full object-cover" />
                            ) : (
                                <span className="text-zinc-500 font-bold text-xs">{(lead.name || 'P').split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()}</span>
                            )}
                        </div>
                        <div className="min-w-0">
                            <p className="text-sm font-bold text-white group-hover/row:text-indigo-400 transition-colors truncate" title={lead.name}>
                                {lead.name}
                            </p>
                            <p className="text-[10px] text-zinc-500 font-medium truncate uppercase tracking-tighter">{lead.country || 'N/A'}</p>
                        </div>
                    </div>
                </div>
            </td>
            <td className="px-6 py-4 border-y border-white/5 group-hover/row:border-white/10">
                <p className="text-xs font-semibold text-zinc-400 truncate max-w-[150px]">{lead.type || 'General'}</p>
            </td>
            <td className="px-6 py-4 border-y border-white/5 group-hover/row:border-white/10">
                <p className="text-xs font-bold text-zinc-300 truncate max-w-[150px]">{lead.company || lead.niche || '—'}</p>
            </td>
            <td className="px-6 py-4 border-y border-white/5 group-hover/row:border-white/10">
                <div className="flex items-center justify-center">
                    {lead.scoring?.score ? (
                        <div className={clsx(
                            "w-9 h-9 rounded-full flex items-center justify-center font-black text-white text-xs border-2 shadow-lg",
                            getScoreTone(lead.scoring.score).cls
                        )} title={`Score: ${lead.scoring.score}/100 • Potencial: ${getScoreTone(lead.scoring.score).label}`}>
                            {lead.scoring.score}
                        </div>
                    ) : (
                        <button
                            onClick={(e) => onAnalyze(e, lead._id)}
                            disabled={analyzingId === lead._id}
                            className="w-9 h-9 rounded-full bg-orange-500 hover:bg-orange-400 disabled:bg-zinc-700 disabled:cursor-not-allowed text-white flex items-center justify-center transition-all shadow-lg shadow-orange-500/20 hover:shadow-orange-500/40 hover:scale-110 active:scale-95"
                            title="Calcular Score"
                        >
                            {analyzingId === lead._id ? <Loader2 size={16} className="animate-spin" /> : <Calculator size={16} />}
                        </button>
                    )}
                </div>
            </td>
            <td className="px-6 py-4 last:rounded-r-2xl border-y border-r border-white/5 group-hover/row:border-white/10 text-right pr-6">
                <div className="flex justify-end gap-1">
                    <button
                        onClick={(e) => { e.stopPropagation(); onSelectLead(lead); }}
                        className="p-2 text-zinc-500 hover:text-indigo-400 hover:bg-indigo-500/10 rounded-xl transition-all"
                    >
                        <Search size={16} />
                    </button>
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            onRemove(lead._id);
                        }}
                        className="p-2 text-zinc-500 hover:text-rose-400 hover:bg-rose-500/10 rounded-xl transition-all"
                        title="Eliminar de la lista"
                    >
                        <Trash2 size={16} />
                    </button>
                </div>
            </td>
        </tr>
    )
}

export default ProspectTableRow
