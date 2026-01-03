import { useState, useMemo } from 'react';
import { Search, LayoutGrid, List as ListIcon, MapPin, Briefcase, Loader2, Sparkles, Calculator, AlertCircle } from 'lucide-react';
import { useLeads, useAnalyzeLead } from '../hooks/useLeads';
import { useLists } from '../hooks/useLists';


import { motion, AnimatePresence } from 'framer-motion';
import clsx from 'clsx';
import LeadDetailModal from '../components/LeadDetailModal';
import CountrySelector from '../components/CountrySelector';
import NicheSelector from '../components/NicheSelector';

const MotionDiv = motion.div;

const getScoreTone = (score) => {
    const s = Number(score) || 0;
    if (s >= 80) return { bucket: 'A', cls: "bg-emerald-500 border-emerald-400 shadow-emerald-500/30", label: 'Alto' };
    if (s >= 60) return { bucket: 'B', cls: "bg-blue-500 border-blue-400 shadow-blue-500/30", label: 'Medio' };
    if (s >= 40) return { bucket: 'C', cls: "bg-amber-500 border-amber-400 shadow-amber-500/30", label: 'Bajo' };
    return { bucket: 'Nurture', cls: "bg-zinc-600 border-zinc-500", label: 'Muy bajo' };
};

const Leads = () => {
    const { data: leads = [] } = useLeads();
    const { data: lists = [] } = useLists();
    const { mutateAsync: analyzeLead } = useAnalyzeLead();

    const [selectedLead, setSelectedLead] = useState(null);
    const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'list'
    const [analysisError, setAnalysisError] = useState(null);

    // Filters
    const [searchTerm, setSearchTerm] = useState('');
    const [countryFilter, setCountryFilter] = useState('');
    const [nicheFilter, setNicheFilter] = useState('');

    const [localAnalyzingId, setLocalAnalyzingId] = useState(null);

    const handleAnalyzeImproved = async (e, lead) => {
        e.stopPropagation();
        setLocalAnalyzingId(lead._id);
        setAnalysisError(null);
        try {
            await analyzeLead(lead._id);
        } catch (error) {
            setAnalysisError(error.message || 'No se pudo completar el análisis automáticamente.');
        } finally {
            setLocalAnalyzingId(null);
        }
    };

    const filteredLeads = useMemo(() => {
        let result = leads;

        if (searchTerm) {
            result = result.filter(l => l.name.toLowerCase().includes(searchTerm.toLowerCase()));
        }

        if (countryFilter) {
            result = result.filter(l => l.country === countryFilter);
        }

        if (nicheFilter) {
            result = result.filter(l => l.niche === nicheFilter);
        }

        return result;
    }, [leads, searchTerm, countryFilter, nicheFilter]);



    const isNew = (dateString) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffTime = Math.abs(now - date);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays <= 7;
    };

    return (
        <div className="space-y-6 max-w-7xl mx-auto">
            <AnimatePresence>
                {analysisError && (
                    <MotionDiv
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="bg-red-500/10 border border-red-500/20 text-red-300 p-4 rounded-xl flex items-start gap-3 backdrop-blur-sm"
                    >
                        <AlertCircle size={18} className="mt-0.5 text-red-400" />
                        <div className="flex-1">
                            <div className="font-semibold">No se pudo calcular el score</div>
                            <div className="text-sm text-red-200/90 mt-1">{analysisError}</div>
                        </div>
                        <button
                            type="button"
                            onClick={() => setAnalysisError(null)}
                            className="text-red-200/80 hover:text-white text-sm font-semibold"
                        >
                            Cerrar
                        </button>
                    </MotionDiv>
                )}
            </AnimatePresence>

            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                    <h2 className="text-3xl font-bold text-white tracking-tight">
                        Mis Prospectos
                    </h2>
                    <p className="text-zinc-400 mt-2">Gestiona y dale seguimiento a tus partners potenciales.</p>
                </div>

                {/* View Toggle */}
                <div className="flex bg-zinc-900/50 p-1 rounded-lg border border-white/10">
                    <button
                        onClick={() => setViewMode('grid')}
                        className={clsx(
                            "p-2 rounded-md transition-colors",
                            viewMode === 'grid' ? "bg-indigo-600 text-white shadow-sm" : "text-zinc-400 hover:text-white"
                        )}
                    >
                        <LayoutGrid size={20} />
                    </button>
                    <button
                        onClick={() => setViewMode('list')}
                        className={clsx(
                            "p-2 rounded-md transition-colors",
                            viewMode === 'list' ? "bg-indigo-600 text-white shadow-sm" : "text-zinc-400 hover:text-white"
                        )}
                    >
                        <ListIcon size={20} />
                    </button>
                </div>
            </div>

            {/* Premium Frame Container */}
            <div className="bg-zinc-900/40 backdrop-blur-md border border-white/10 rounded-2xl p-6 shadow-2xl relative overflow-hidden">
                {/* Decorative gradients for the frame */}
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-indigo-500/50 to-transparent opacity-50"></div>

                {/* Filters Bar */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="relative z-30">
                        <label className="block text-sm font-medium text-zinc-400 mb-1.5 ml-1">Buscar</label>
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" size={16} />
                            <input
                                type="text"
                                placeholder="Buscar por nombre..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full h-[50px] bg-black/40 border border-white/10 rounded-xl pl-10 pr-4 text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all shadow-inner"
                            />
                        </div>
                    </div>
                    <div className="relative z-30">
                        <label className="block text-sm font-medium text-zinc-400 mb-1.5 ml-1">País</label>
                        <CountrySelector value={countryFilter} onChange={setCountryFilter} />
                    </div>
                    <div className="relative z-30">
                        <label className="block text-sm font-medium text-zinc-400 mb-1.5 ml-1">Rubro</label>
                        <NicheSelector value={nicheFilter} onChange={setNicheFilter} />
                    </div>
                </div>

                {/* Results */}
                <AnimatePresence mode="wait">
                    {viewMode === 'grid' ? (
                        <MotionDiv
                            key="grid"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-fr"
                        >
                            {filteredLeads.map(lead => (
                                <MotionDiv
                                    key={lead._id}
                                    layoutId={lead._id}
                                    onClick={() => setSelectedLead(lead)}
                                    className="group relative bg-zinc-800/80 border border-white/10 rounded-2xl cursor-pointer overflow-hidden transition-all duration-300 hover:scale-[1.02] hover:shadow-[0_0_30px_rgba(79,70,229,0.25)] hover:border-indigo-500/40 shadow-lg shadow-black/20 backdrop-blur-sm h-full flex flex-col"
                                >
                                    {/* Default slight gradient to make it pop */}
                                    <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-30" />

                                    {/* Card Glow Effect on Hover */}
                                    <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 via-purple-500/5 to-pink-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                                    <div className="absolute -inset-[1px] bg-gradient-to-r from-indigo-500 to-purple-500 rounded-2xl opacity-0 group-hover:opacity-30 blur-sm transition-opacity duration-300 pointer-events-none" />

                                    {/* Fixed Position "New" Badge */}
                                    {isNew(lead.createdAt) && (
                                        <div className="absolute top-4 right-4 z-20">
                                            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-lg shadow-indigo-500/40 uppercase tracking-wide">
                                                New
                                            </span>
                                        </div>
                                    )}

                                    <div className="relative z-10 p-6 flex flex-col h-full">
                                        <div className="mb-4">
                                            {/* Padding right ensures text doesn't overlap with the absolute badge */}
                                            <h3 className="font-bold text-lg text-white leading-tight group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-indigo-200 transition-all tracking-tight drop-shadow-md pr-12 truncate">
                                                {lead.name}
                                            </h3>
                                            <p className="text-zinc-400 text-sm mt-1.5 font-medium truncate">{lead.type}</p>

                                            {/* List Membership Badges */}
                                            <div className="flex flex-wrap gap-1 mt-3">
                                                {lists.filter(l => (l.prospects || []).includes(lead._id)).map(l => (
                                                    <span key={l._id} className="px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 text-[10px] font-bold uppercase tracking-tight">
                                                        {l.name}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>

                                        <div className="mt-auto pt-4 border-t border-white/5 flex items-end justify-between gap-2">
                                            {/* Left side: Tags */}
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

                                            {/* Right side: Scoring Action or Result */}
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
                                                            onClick={(e) => handleAnalyzeImproved(e, lead)}
                                                            disabled={localAnalyzingId === lead._id}
                                                            className="w-10 h-10 rounded-full bg-orange-500 hover:bg-orange-400 disabled:bg-zinc-700 disabled:cursor-not-allowed text-white flex items-center justify-center transition-all shadow-lg shadow-orange-500/20 hover:shadow-orange-500/40 hover:scale-110 active:scale-95"
                                                        >
                                                            {localAnalyzingId === lead._id ? (
                                                                <Loader2 size={18} className="animate-spin" />
                                                            ) : (
                                                                <Calculator size={18} />
                                                            )}
                                                        </button>
                                                        {/* Tooltip */}
                                                        <span className="absolute bottom-full right-0 mb-2 px-2 py-1 text-xs font-bold text-white bg-black/90 rounded border border-white/10 opacity-0 group-hover/tooltip:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-20">
                                                            Calcular Score
                                                        </span>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </MotionDiv>
                            ))}
                        </MotionDiv>
                    ) : (
                        <MotionDiv
                            key="list"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="bg-black/20 border border-white/5 rounded-xl overflow-hidden shadow-xl"
                        >
                            <div className="overflow-x-auto">
                                <table className="w-full text-left border-collapse">
                                    <thead>
                                        <tr className="bg-white/5 border-b border-white/5 text-xs uppercase tracking-wider text-zinc-400">
                                            <th className="px-6 py-4 font-medium">Organización</th>
                                            <th className="px-6 py-4 font-medium">Ubicación</th>
                                            <th className="px-6 py-4 font-medium">Rubro</th>
                                            <th className="px-6 py-4 font-medium">Listas</th>
                                            <th className="px-6 py-4 font-medium">Estado</th>
                                            <th className="px-6 py-4 font-medium text-right">Fecha</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-white/5">
                                        {filteredLeads.map(lead => (
                                            <tr
                                                key={lead._id}
                                                onClick={() => setSelectedLead(lead)}
                                                className="hover:bg-white/5 transition-colors cursor-pointer group"
                                            >
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-3">
                                                        <div>
                                                            <div className="flex items-center gap-2">
                                                                <span className="font-medium text-white group-hover:text-indigo-400 transition-colors">
                                                                    {lead.name}
                                                                </span>
                                                                {isNew(lead.createdAt) && (
                                                                    <span className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse"></span>
                                                                )}
                                                            </div>
                                                            <div className="text-xs text-zinc-500">{lead.type}</div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-2 text-sm text-zinc-300">
                                                        <span className="text-xl">{lead.country === 'Argentina' ? '🇦🇷' : lead.country === 'España' ? '🇪🇸' : '🌍'}</span>
                                                        {/* Fallback simple flag logic, could be better if country selector exported utility */}
                                                        <span>{lead.country}</span>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 text-sm text-zinc-300">
                                                    {lead.niche}
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="flex flex-wrap gap-1 max-w-[200px]">
                                                        {lists.filter(l => (l.prospects || []).includes(lead._id)).map(l => (
                                                            <span key={l._id} className="px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 text-[9px] font-bold uppercase overflow-hidden text-ellipsis whitespace-nowrap">
                                                                {l.name}
                                                            </span>
                                                        ))}
                                                        {lists.filter(l => (l.prospects || []).includes(lead._id)).length === 0 && (
                                                            <span className="text-zinc-600 text-[10px]">—</span>
                                                        )}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className="inline-flex px-2 py-1 rounded text-xs font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                                                        {lead.status}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 text-right text-sm text-zinc-500">
                                                    {new Date(lead.createdAt).toLocaleDateString()}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </MotionDiv>
                    )}
                </AnimatePresence>

                {filteredLeads.length === 0 && (
                    <div className="flex flex-col items-center justify-center py-24 text-center bg-zinc-900/40 backdrop-blur-sm rounded-2xl border border-white/5 border-dashed">
                        <div className="bg-zinc-800/50 p-4 rounded-full mb-4 ring-1 ring-white/10 shadow-xl">
                            <Search className="text-zinc-500" size={32} />
                        </div>
                        <h3 className="text-xl font-bold text-white mb-2">No se encontraron resultados</h3>
                        <p className="text-zinc-400 max-w-sm mx-auto mb-6">
                            No hay prospectos que coincidan con los filtros aplicados. Intenta con otros términos o limpia la búsqueda.
                        </p>
                        <button
                            onClick={() => {
                                setSearchTerm('');
                                setCountryFilter('');
                                setNicheFilter('');
                            }}
                            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium rounded-lg transition-colors shadow-lg shadow-indigo-500/20"
                        >
                            Limpiar filtros
                        </button>
                    </div>
                )}
            </div>

            {/* Lead Detail Modal */}
            <LeadDetailModal
                isOpen={!!selectedLead}
                lead={selectedLead}
                onClose={() => setSelectedLead(null)}
                onUpdate={() => {
                    setSelectedLead(null);
                }}
            />
        </div>
    );
};

export default Leads;
