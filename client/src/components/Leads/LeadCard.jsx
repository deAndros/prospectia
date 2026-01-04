import { MapPin, Briefcase, Calculator, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';
import clsx from 'clsx';

const MotionDiv = motion.div;

const getScoreTone = (score) => {
    const s = Number(score) || 0;
    if (s >= 80) return { bucket: 'A', cls: "bg-emerald-500 border-emerald-400 shadow-emerald-500/30", label: 'Alto' };
    if (s >= 60) return { bucket: 'B', cls: "bg-blue-500 border-blue-400 shadow-blue-500/30", label: 'Medio' };
    if (s >= 40) return { bucket: 'C', cls: "bg-amber-500 border-amber-400 shadow-amber-500/30", label: 'Bajo' };
    return { bucket: 'Nurture', cls: "bg-zinc-600 border-zinc-500", label: 'Muy bajo' };
};

const isNew = (dateString) => {
    if (!dateString) return false;
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays <= 7;
};

const LeadCard = ({ lead, onClick, onAnalyze, analyzingId, lists }) => {
    const leadLists = lists.filter(l => (l.prospects || []).includes(lead._id));

    return (
        <MotionDiv
            layoutId={lead._id}
            onClick={() => onClick(lead)}
            className="group relative bg-zinc-800/80 border border-white/10 rounded-2xl cursor-pointer overflow-hidden transition-all duration-300 hover:scale-[1.02] hover:shadow-[0_0_30px_rgba(79,70,229,0.25)] hover:border-indigo-500/40 shadow-lg shadow-black/20 backdrop-blur-sm h-full flex flex-col"
        >
            {/* Gradiente ligero por defecto para resaltar */}
            <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-30" />

            {/* Efecto de resplandor de la tarjeta al pasar el cursor */}
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 via-purple-500/5 to-pink-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <div className="absolute -inset-[1px] bg-gradient-to-r from-indigo-500 to-purple-500 rounded-2xl opacity-0 group-hover:opacity-30 blur-sm transition-opacity duration-300 pointer-events-none" />

            {/* Insignia "Nuevo" en posición fija */}
            {isNew(lead.createdAt) && (
                <div className="absolute top-4 right-4 z-20">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-lg shadow-indigo-500/40 uppercase tracking-wide">
                        New
                    </span>
                </div>
            )}

            <div className="relative z-10 p-6 flex flex-col h-full">
                <div className="mb-4">
                    <h3 className="font-bold text-lg text-white leading-tight group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-indigo-200 transition-all tracking-tight drop-shadow-md pr-12 truncate">
                        {lead.name}
                    </h3>
                    <p className="text-zinc-400 text-sm mt-1.5 font-medium truncate">{lead.type}</p>

                    {/* Insignias de membresía de lista */}
                    <div className="flex flex-wrap gap-1 mt-3">
                        {leadLists.map(l => (
                            <span key={l._id} className="px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 text-[10px] font-bold uppercase tracking-tight truncate max-w-[120px]">
                                {l.name}
                            </span>
                        ))}
                    </div>
                </div>

                <div className="mt-auto pt-4 border-t border-white/5 flex items-end justify-between gap-2">
                    <div className="flex flex-col gap-2">
                        <div className="flex gap-2 items-center flex-wrap">
                            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-black/40 text-zinc-300 border border-white/10 group-hover:border-indigo-500/20 transition-colors">
                                <MapPin size={12} className="text-indigo-400" />
                                {lead.country}
                            </div>
                            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-black/40 text-zinc-300 border border-white/10 group-hover:border-purple-500/20 transition-colors">
                                <Briefcase size={12} className="text-purple-400" />
                                {lead.niche}
                            </div>
                        </div>
                    </div>

                    <div className="flex-shrink-0 relative">
                        {lead.scoring && typeof lead.scoring.score === 'number' ? (
                            <div className={clsx(
                                "w-10 h-10 rounded-full flex items-center justify-center font-black text-white text-sm border-2 shadow-lg",
                                getScoreTone(lead.scoring.score).cls
                            )} title={`Score: ${lead.scoring.score}/100 • Potencial: ${getScoreTone(lead.scoring.score).label}`}>
                                {lead.scoring.score}
                            </div>
                        ) : (
                            <div className="group/tooltip relative">
                                <button
                                    onClick={(e) => onAnalyze(e, lead)}
                                    disabled={analyzingId === lead._id}
                                    className="w-10 h-10 rounded-full bg-orange-500 hover:bg-orange-400 disabled:bg-zinc-700 disabled:cursor-not-allowed text-white flex items-center justify-center transition-all shadow-lg shadow-orange-500/20 hover:shadow-orange-500/40 hover:scale-110 active:scale-95"
                                >
                                    {analyzingId === lead._id ? (
                                        <Loader2 size={18} className="animate-spin" />
                                    ) : (
                                        <Calculator size={18} />
                                    )}
                                </button>
                                <span className="absolute bottom-full right-0 mb-2 px-2 py-1 text-xs font-bold text-white bg-black/90 rounded border border-white/10 opacity-0 group-hover/tooltip:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-20">
                                    Calcular Score
                                </span>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </MotionDiv>
    );
};

export default LeadCard;
