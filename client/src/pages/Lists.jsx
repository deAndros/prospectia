import { useMemo, useState, useEffect } from 'react'
import {
    Plus,
    Search,
    ChevronRight,
    ChevronLeft,
    Trash2,
    Users,
    Briefcase,
    MapPin,
    Check,
    X,
    Filter,
    ArrowUpDown,
    UserPlus,
    LayoutGrid,
    Linkedin,
    Loader2,
    AlertCircle,
    Calculator
} from 'lucide-react'
import clsx from 'clsx'
import {
    useLists,
    useListOptions,
    useLeadsForLists,
    useCreateList,
    useUpdateList,
    useDeleteList,
} from '../hooks/useLists'
import { useAnalyzeLead } from '../hooks/useLeads'
import ConfirmModal from '../components/ConfirmModal'
import LeadDetailModal from '../components/LeadDetailModal'
import CountrySelector from '../components/CountrySelector'
import NicheSelector from '../components/NicheSelector'

// --- Constants & Helpers ---

const STEPS = [
    { id: 1, title: 'Países', description: 'Filtra por ubicación' },
    { id: 2, title: 'Rubros', description: 'Filtra por industria' },
    { id: 3, title: 'Score', description: 'Filtra por calidad' },
]

const getScoreTone = (score) => {
    const s = Number(score) || 0;
    if (s >= 80) return { bucket: 'A', cls: "bg-emerald-500 border-emerald-400 shadow-emerald-500/30", label: 'Alto' };
    if (s >= 60) return { bucket: 'B', cls: "bg-blue-500 border-blue-400 shadow-blue-500/30", label: 'Medio' };
    return { bucket: 'Nurture', cls: "bg-zinc-600 border-zinc-500", label: 'Bajo' };
};

// --- Components ---

const Wizard = ({ isOpen, onClose, options, leads, onCreate }) => {
    const [step, setStep] = useState(1)
    const [name, setName] = useState('')
    const [selectedCountries, setSelectedCountries] = useState([])
    const [selectedNiches, setSelectedNiches] = useState([])
    const [scoreMin, setScoreMin] = useState(1)
    const [scoreMax, setScoreMax] = useState(100)

    useEffect(() => {
        if (!isOpen) {
            setStep(1)
            setName('')
            setSelectedCountries([])
            setSelectedNiches([])
            setScoreMin(1)
            setScoreMax(100)
        }
    }, [isOpen])

    if (!isOpen) return null

    const filteredByCountries = leads.filter(l =>
        selectedCountries.length === 0 || selectedCountries.includes(l.country)
    )

    const filteredByNiches = filteredByCountries.filter(l =>
        selectedNiches.length === 0 || selectedNiches.includes(l.niche)
    )

    const finalProspects = filteredByNiches.filter(l => {
        const s = l.scoring?.score || 0
        return s >= scoreMin && s <= scoreMax
    })

    const currentCount = finalProspects.length

    const handleNext = () => setStep(s => s + 1)
    const handleBack = () => setStep(s => s - 1)

    const handleFinish = () => {
        if (!name) return alert('Por favor, ingresa un nombre para la lista')
        onCreate({
            name,
            prospects: finalProspects.map(p => p._id),
            filter: {
                countries: selectedCountries,
                niches: selectedNiches,
                scoreMin,
                scoreMax
            }
        })
        onClose()
    }

    const toggleItem = (list, setList, item) => {
        if (list.includes(item)) setList(list.filter(i => i !== item))
        else setList([...list, item])
    }

    return (
        <div className="fixed inset-0 z-[10000] bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
            <div className="bg-zinc-900 border border-white/10 rounded-3xl w-full max-w-2xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden">
                {/* Header */}
                <div className="p-8 border-b border-white/5 flex items-center justify-between bg-black/20">
                    <div>
                        <h2 className="text-2xl font-black text-white uppercase tracking-tighter">Nueva lista inteligente</h2>
                        <p className="text-zinc-500 text-xs font-bold uppercase tracking-widest mt-1">Paso {step} de 3 • {STEPS[step - 1].title}</p>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-xl text-zinc-500 transition-colors">
                        <X size={24} />
                    </button>
                </div>

                {/* Progress Bar */}
                <div className="h-1 bg-white/5 w-full">
                    <div
                        className="h-full bg-indigo-500 transition-all duration-500 shadow-[0_0_10px_rgba(99,102,241,0.5)]"
                        style={{ width: `${(step / 3) * 100}%` }}
                    />
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
                    {step === 1 && (
                        <div className="space-y-6">
                            <div className="flex items-center justify-between">
                                <h3 className="text-lg font-bold text-white">Selecciona países</h3>
                                <span className="text-xs font-bold text-zinc-500">{selectedCountries.length} seleccionados</span>
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                                {options.countries.map(c => (
                                    <button
                                        key={c}
                                        onClick={() => toggleItem(selectedCountries, setSelectedCountries, c)}
                                        className={clsx(
                                            "flex items-center justify-between p-4 rounded-2xl border transition-all font-bold text-sm",
                                            selectedCountries.includes(c)
                                                ? "bg-indigo-500/10 border-indigo-500 text-indigo-300 shadow-inner"
                                                : "bg-white/5 border-white/5 text-zinc-500 hover:border-white/10 hover:bg-white/10"
                                        )}
                                    >
                                        <span>{c}</span>
                                        {selectedCountries.includes(c) && <Check size={16} />}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {step === 2 && (
                        <div className="space-y-6">
                            <div className="flex items-center justify-between">
                                <h3 className="text-lg font-bold text-white">Selecciona rubros</h3>
                                <span className="text-xs font-bold text-zinc-500">{selectedNiches.length} seleccionados</span>
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                                {options.niches.map(n => (
                                    <button
                                        key={n}
                                        onClick={() => toggleItem(selectedNiches, setSelectedNiches, n)}
                                        className={clsx(
                                            "flex items-center justify-between p-4 rounded-2xl border transition-all font-bold text-sm",
                                            selectedNiches.includes(n)
                                                ? "bg-purple-500/10 border-purple-500 text-purple-300 shadow-inner"
                                                : "bg-white/5 border-white/5 text-zinc-500 hover:border-white/10 hover:bg-white/10"
                                        )}
                                    >
                                        <span>{n}</span>
                                        {selectedNiches.includes(n) && <Check size={16} />}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {step === 3 && (
                        <div className="space-y-8">
                            <div>
                                <h3 className="text-lg font-bold text-white mb-6">Configuración final</h3>
                                <div className="space-y-4">
                                    <label className="text-sm font-medium text-zinc-400 block ml-1">Rango de Score (Potencial)</label>
                                    <div className="flex items-center gap-4">
                                        <input
                                            type="number"
                                            min="0"
                                            max="100"
                                            value={scoreMin}
                                            onChange={e => setScoreMin(Number(e.target.value))}
                                            className="w-24 bg-black/40 border border-white/10 rounded-xl p-3 text-white text-center font-bold"
                                        />
                                        <div className="flex-1 h-2 bg-white/5 rounded-full overflow-hidden relative">
                                            <div className="absolute inset-0 bg-gradient-to-r from-zinc-500 via-indigo-500 to-emerald-500 opacity-20" />
                                            <div
                                                className="absolute h-full bg-indigo-500"
                                                style={{ left: `${scoreMin}%`, right: `${100 - scoreMax}%` }}
                                            />
                                        </div>
                                        <input
                                            type="number"
                                            min="0"
                                            max="100"
                                            value={scoreMax}
                                            onChange={e => setScoreMax(Number(e.target.value))}
                                            className="w-24 bg-black/40 border border-white/10 rounded-xl p-3 text-white text-center font-bold"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div>
                                <label className="text-sm font-medium text-zinc-300 block mb-2">Nombre de la lista</label>
                                <input
                                    autoFocus
                                    placeholder="Ej: Leads High Score Argentina"
                                    value={name}
                                    onChange={e => setName(e.target.value)}
                                    className="w-full bg-black/40 border border-white/10 rounded-xl p-4 text-white focus:ring-2 focus:ring-indigo-500 outline-none"
                                />
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="p-6 border-t border-white/5 flex items-center justify-between bg-black/20 rounded-b-2xl">
                    <div className="flex items-center gap-2 text-indigo-400">
                        <Users size={16} />
                        <span className="text-sm font-bold">{currentCount} prospectos seleccionados</span>
                    </div>
                    <div className="flex gap-3">
                        {step > 1 && (
                            <button
                                onClick={handleBack}
                                className="px-4 py-2 text-sm font-medium text-zinc-400 hover:text-white transition-colors"
                            >
                                Anterior
                            </button>
                        )}
                        {step < 3 ? (
                            <button
                                onClick={handleNext}
                                className="px-6 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-bold rounded-xl transition-all shadow-lg shadow-indigo-500/20"
                            >
                                Siguiente
                            </button>
                        ) : (
                            <button
                                onClick={handleFinish}
                                className="px-6 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white text-sm font-bold rounded-xl transition-all shadow-lg shadow-indigo-500/40"
                            >
                                Generar Lista
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}

const AddProspectModal = ({ isOpen, onClose, leads, currentProspects, onAdd }) => {
    const [search, setSearch] = useState('')
    const [country, setCountry] = useState('')
    const [niche, setNiche] = useState('')
    const [selectedIds, setSelectedIds] = useState(new Set())

    useEffect(() => {
        if (!isOpen) {
            setSearch('')
            setCountry('')
            setNiche('')
            setSelectedIds(new Set())
        }
    }, [isOpen])

    if (!isOpen) return null

    const filtered = leads.filter(l => {
        if (currentProspects.includes(l._id)) return false
        if (search && !(l.name || '').toLowerCase().includes(search.toLowerCase())) return false
        if (country && l.country !== country) return false
        if (niche && l.niche !== niche) return false
        return true
    })

    const countries = [...new Set(leads.map(l => l.country))].filter(Boolean).sort()
    const niches = [...new Set(leads.map(l => l.niche))].filter(Boolean).sort()

    const toggle = (id) => {
        const next = new Set(selectedIds)
        if (next.has(id)) next.delete(id)
        else next.add(id)
        setSelectedIds(next)
    }

    return (
        <div className="fixed inset-0 z-[10000] bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
            <div className="bg-zinc-900 border border-white/10 rounded-2xl w-full max-w-2xl shadow-2xl flex flex-col max-h-[80vh]">
                <div className="p-6 border-b border-white/5 flex items-center justify-between">
                    <h2 className="text-xl font-bold text-white">Agregar Prospectos</h2>
                    <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-lg text-zinc-400">
                        <X size={20} />
                    </button>
                </div>

                <div className="p-6 space-y-4">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" size={16} />
                        <input
                            placeholder="Buscar por nombre..."
                            value={search} onChange={e => setSearch(e.target.value)}
                            className="w-full bg-black/40 border border-white/10 rounded-xl pl-10 pr-4 py-3 text-sm text-white"
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <select
                            value={country} onChange={e => setCountry(e.target.value)}
                            className="bg-black/40 border border-white/10 rounded-xl px-4 py-2 text-sm text-white"
                        >
                            <option value="">Todos los países</option>
                            {countries.map(c => <option key={c} value={c}>{c}</option>)}
                        </select>
                        <select
                            value={niche} onChange={e => setNiche(e.target.value)}
                            className="bg-black/40 border border-white/10 rounded-xl px-4 py-2 text-sm text-white"
                        >
                            <option value="">Todos los rubros</option>
                            {niches.map(n => <option key={n} value={n}>{n}</option>)}
                        </select>
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto px-6 custom-scrollbar pb-6">
                    <div className="space-y-2">
                        {filtered.map(l => (
                            <button
                                key={l._id}
                                onClick={() => toggle(l._id)}
                                className={clsx(
                                    "w-full flex items-center justify-between p-3 rounded-xl border transition-all text-left",
                                    selectedIds.has(l._id) ? "bg-indigo-500/10 border-indigo-500" : "bg-black/20 border-white/5 hover:border-white/10"
                                )}
                            >
                                <div>
                                    <div className="text-sm font-bold text-white">{l.name}</div>
                                    <div className="text-xs text-zinc-500">{l.country} · {l.niche}</div>
                                </div>
                                <div className={clsx(
                                    "w-5 h-5 rounded flex items-center justify-center border transition-all",
                                    selectedIds.has(l._id) ? "bg-indigo-500 border-indigo-500 text-white" : "bg-black/40 border-white/20 text-transparent"
                                )}>
                                    <Check size={12} strokeWidth={4} />
                                </div>
                            </button>
                        ))}
                    </div>
                </div>

                <div className="p-6 border-t border-white/5 bg-black/20 rounded-b-2xl flex justify-between items-center">
                    <span className="text-sm text-zinc-400">{selectedIds.size} seleccionados</span>
                    <div className="flex gap-2">
                        <button onClick={onClose} className="px-4 py-2 text-sm text-zinc-400 hover:text-white">Cancelar</button>
                        <button
                            disabled={selectedIds.size === 0}
                            onClick={() => { onAdd(Array.from(selectedIds)); onClose(); }}
                            className="px-6 py-2 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white text-sm font-bold rounded-xl transition-all"
                        >
                            Agregar Seleccionados
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

const ProspectTable = ({ leads, selectedList, onRemove, onAddClick, onSelectLead }) => {
    const [search, setSearch] = useState('')
    const [countryFilter, setCountryFilter] = useState('')
    const [nicheFilter, setNicheFilter] = useState('')
    const [currentPage, setCurrentPage] = useState(1)
    const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' })
    const pageSize = 10

    const { mutateAsync: analyzeLead, isPending } = useAnalyzeLead()
    const [analyzingId, setAnalyzingId] = useState(null)

    const filteredAndSorted = useMemo(() => {
        let result = leads;
        const term = search.toLowerCase()

        if (term) {
            result = result.filter(l => (l.name || '').toLowerCase().includes(term));
        }

        if (countryFilter) {
            result = result.filter(l => l.country === countryFilter);
        }

        if (nicheFilter) {
            result = result.filter(l => l.niche === nicheFilter);
        }

        if (sortConfig.key) {
            result = [...result].sort((a, b) => {
                let aV = a[sortConfig.key];
                let bV = b[sortConfig.key];

                if (sortConfig.key === 'score') {
                    aV = a.scoring?.score || 0;
                    bV = b.scoring?.score || 0;
                } else if (sortConfig.key === 'rubro') {
                    aV = (a.company || a.niche || '').toLowerCase();
                    bV = (b.company || b.niche || '').toLowerCase();
                } else if (typeof aV === 'string') {
                    aV = aV.toLowerCase();
                    bV = (bV || '').toLowerCase();
                }

                if (aV < bV) return sortConfig.direction === 'asc' ? -1 : 1;
                if (aV > bV) return sortConfig.direction === 'asc' ? 1 : -1;
                return 0;
            });
        }

        return result;
    }, [leads, search, countryFilter, nicheFilter, sortConfig])

    // Reset to page 1 when any filter or sort changes
    useEffect(() => {
        setCurrentPage(1)
    }, [search, countryFilter, nicheFilter, selectedList, sortConfig.key, sortConfig.direction])

    const totalPages = Math.ceil(filteredAndSorted.length / pageSize)
    const paginatedLeads = useMemo(() => {
        const start = (currentPage - 1) * pageSize
        return filteredAndSorted.slice(start, start + pageSize)
    }, [filteredAndSorted, currentPage])

    const handleSort = (key) => {
        setSortConfig(current => ({
            key,
            direction: current.key === key && current.direction === 'asc' ? 'desc' : 'asc'
        }))
    }

    const handleAnalyze = async (e, leadId) => {
        e.stopPropagation()
        setAnalyzingId(leadId)
        try {
            await analyzeLead(leadId)
        } finally {
            setAnalyzingId(null)
        }
    }

    return (
        <div className="flex-1 flex flex-col min-w-0">
            <div className="flex items-end justify-between mb-8 gap-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 flex-1 max-w-5xl">
                    <div className="relative group">
                        <label className="block text-sm font-medium text-zinc-400 mb-1.5 ml-1">Buscador</label>
                        <div className="relative">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 group-focus-within:text-indigo-400 transition-colors" size={18} />
                            <input
                                type="text"
                                placeholder="Buscar por nombre..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="w-full bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl h-[50px] pl-12 pr-4 text-base text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 transition-all font-medium"
                            />
                        </div>
                    </div>
                    <div className="relative">
                        <label className="block text-sm font-medium text-zinc-400 mb-1.5 ml-1">País</label>
                        <CountrySelector value={countryFilter} onChange={setCountryFilter} />
                    </div>
                    <div className="relative">
                        <label className="block text-sm font-medium text-zinc-400 mb-1.5 ml-1">Rubro</label>
                        <NicheSelector value={nicheFilter} onChange={setNicheFilter} />
                    </div>
                </div>

                <div className="flex items-center gap-4 mb-0.5">
                    {/* Mini Pagination UI at Top */}
                    {totalPages > 1 && (
                        <div className="flex items-center gap-4 px-4 h-[50px] bg-white/5 border border-white/10 rounded-2xl backdrop-blur-xl">
                            <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest whitespace-nowrap">
                                {currentPage} / {totalPages}
                            </span>
                            <div className="flex items-center gap-1 border-l border-white/10 pl-3">
                                <button
                                    disabled={currentPage === 1}
                                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                                    className="p-1 text-zinc-500 hover:text-white disabled:opacity-20 transition-colors"
                                >
                                    <ChevronLeft size={16} />
                                </button>
                                <button
                                    disabled={currentPage === totalPages}
                                    onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                                    className="p-1 text-zinc-500 hover:text-white disabled:opacity-20 transition-colors"
                                >
                                    <ChevronRight size={16} />
                                </button>
                            </div>
                        </div>
                    )}

                    {selectedList && (
                        <button
                            onClick={onAddClick}
                            className="bg-indigo-600 hover:bg-indigo-500 text-white px-5 h-[50px] rounded-2xl text-sm font-bold transition-all flex items-center gap-2 active:scale-95 shadow-xl shadow-indigo-500/20 whitespace-nowrap"
                        >
                            <Plus size={18} />
                            <span>Añadir prospecto</span>
                        </button>
                    )}
                </div>
            </div>

            <div className="flex-1 overflow-y-auto custom-scrollbar">
                <table className="w-full text-left border-separate border-spacing-y-2">
                    <thead>
                        <tr className="text-[11px] font-black text-zinc-500 uppercase tracking-widest">
                            <th
                                className="px-6 py-4 font-black cursor-pointer hover:text-white transition-colors group/h"
                                onClick={() => handleSort('name')}
                            >
                                <div className="flex items-center gap-2">
                                    <div className="w-5 h-5 rounded border-2 border-zinc-800 flex items-center justify-center group-hover/h:border-indigo-500/50"></div>
                                    <div className="flex items-center gap-1">
                                        <Users size={14} />
                                        <span>Nombre</span>
                                        <ArrowUpDown size={12} className={clsx("ml-1 transition-opacity", sortConfig.key === 'name' ? "opacity-100 text-indigo-400" : "opacity-0 group-hover/h:opacity-50")} />
                                    </div>
                                </div>
                            </th>
                            <th
                                className="px-6 py-4 font-black cursor-pointer hover:text-white transition-colors group/h"
                                onClick={() => handleSort('type')}
                            >
                                <div className="flex items-center gap-1">
                                    <Briefcase size={14} />
                                    <span>Tipo</span>
                                    <ArrowUpDown size={12} className={clsx("ml-1 transition-opacity", sortConfig.key === 'type' ? "opacity-100 text-indigo-400" : "opacity-0 group-hover/h:opacity-50")} />
                                </div>
                            </th>
                            <th
                                className="px-6 py-4 font-black cursor-pointer hover:text-white transition-colors group/h"
                                onClick={() => handleSort('rubro')}
                            >
                                <div className="flex items-center gap-1">
                                    <LayoutGrid size={14} />
                                    <span>Rubro</span>
                                    <ArrowUpDown size={12} className={clsx("ml-1 transition-opacity", sortConfig.key === 'rubro' ? "opacity-100 text-indigo-400" : "opacity-0 group-hover/h:opacity-50")} />
                                </div>
                            </th>
                            <th
                                className="px-6 py-4 font-black text-center cursor-pointer hover:text-white transition-colors group/h"
                                onClick={() => handleSort('score')}
                            >
                                <div className="flex items-center justify-center gap-1">
                                    <span>Score</span>
                                    <ArrowUpDown size={12} className={clsx("ml-1 transition-opacity", sortConfig.key === 'score' ? "opacity-100 text-indigo-400" : "opacity-0 group-hover/h:opacity-50")} />
                                </div>
                            </th>
                            <th className="px-6 py-4 font-black text-right pr-10">Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {paginatedLeads.map((lead) => (
                            <tr
                                key={lead._id}
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
                                                onClick={(e) => handleAnalyze(e, lead._id)}
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
                        ))}
                        {paginatedLeads.length === 0 && (
                            <tr>
                                <td colSpan={5} className="py-20 text-center">
                                    <div className="flex flex-col items-center gap-3">
                                        <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center text-zinc-600">
                                            <Search size={32} />
                                        </div>
                                        <div>
                                            <p className="text-white font-bold">No se encontraron prospectos</p>
                                            <p className="text-zinc-500 text-sm">Intenta ajustar tus términos de búsqueda.</p>
                                        </div>
                                    </div>
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Main Pagination Controls at Bottom */}
            {totalPages > 1 && (
                <div className="mt-6 flex items-center justify-between px-6 py-4 bg-white/5 border border-white/10 rounded-2xl backdrop-blur-xl">
                    <p className="text-xs text-zinc-500 font-bold">
                        Mostrando <span className="text-white">{(currentPage - 1) * pageSize + 1}</span> - <span className="text-white">{Math.min(currentPage * pageSize, filteredAndSorted.length)}</span> de <span className="text-white">{filteredAndSorted.length}</span> prospectos
                    </p>
                    <div className="flex items-center gap-2">
                        <button
                            disabled={currentPage === 1}
                            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                            className="px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-xs font-bold text-zinc-400 hover:bg-white/10 hover:text-white disabled:opacity-20 transition-all flex items-center gap-2"
                        >
                            <ChevronLeft size={14} />
                            Anterior
                        </button>
                        <div className="flex items-center gap-1">
                            {[...Array(totalPages)].map((_, i) => (
                                <button
                                    key={i}
                                    onClick={() => setCurrentPage(i + 1)}
                                    className={clsx(
                                        "w-8 h-8 rounded-lg text-xs font-bold transition-all",
                                        currentPage === i + 1 ? "bg-indigo-600 text-white shadow-lg shadow-indigo-500/40" : "text-zinc-500 hover:bg-white/5 hover:text-zinc-300"
                                    )}
                                >
                                    {i + 1}
                                </button>
                            ))}
                        </div>
                        <button
                            disabled={currentPage === totalPages}
                            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                            className="px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-xs font-bold text-zinc-400 hover:bg-white/10 hover:text-white disabled:opacity-20 transition-all flex items-center gap-2"
                        >
                            Siguiente
                            <ChevronRight size={14} />
                        </button>
                    </div>
                </div>
            )}
        </div>
    )
}

// --- Main Page ---

const Lists = () => {
    const { data: lists = [], isLoading } = useLists()
    const { data: options = { countries: [], niches: [] } } = useListOptions()
    const { data: leads = [] } = useLeadsForLists()

    const createMutation = useCreateList()
    const updateMutation = useUpdateList()
    const deleteMutation = useDeleteList()

    const [selectedListId, setSelectedListId] = useState(null)
    const [listSearch, setListSearch] = useState('')
    const [sortBy, setSortBy] = useState('newest') // newest | alpha
    const [showWizard, setShowWizard] = useState(false)
    const [showAddModal, setShowAddModal] = useState(false)
    const [confirmDelete, setConfirmDelete] = useState(null)
    const [selectedLead, setSelectedLead] = useState(null)

    const selectedList = useMemo(() => lists.find(l => l._id === selectedListId), [lists, selectedListId])

    const filteredLists = useMemo(() => {
        let result = lists.filter(l => l.name.toLowerCase().includes(listSearch.toLowerCase()))
        if (sortBy === 'alpha') result.sort((a, b) => a.name.localeCompare(b.name))
        else result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        return result
    }, [lists, listSearch, sortBy])

    const tableLeads = useMemo(() => {
        if (!selectedList) return leads
        const prospectIds = new Set(selectedList.prospects || [])
        return leads.filter(l => prospectIds.has(l._id))
    }, [leads, selectedList])

    const handleCreateList = async (data) => {
        try {
            await createMutation.mutateAsync(data)
        } catch (err) {
            alert('Error: ' + err.message)
        }
    }

    const handleRemoveFromList = async (prospectId) => {
        if (!selectedList) return
        const nextProspects = (selectedList.prospects || []).filter(id => id !== prospectId)
        try {
            await updateMutation.mutateAsync({ id: selectedList._id, data: { prospects: nextProspects } })
        } catch (err) {
            alert('Error: ' + err.message)
        }
    }

    const handleAddToList = async (prospectIds) => {
        if (!selectedList) return
        const nextProspects = [...new Set([...(selectedList.prospects || []), ...prospectIds])]
        try {
            await updateMutation.mutateAsync({ id: selectedList._id, data: { prospects: nextProspects } })
        } catch (err) {
            alert('Error: ' + err.message)
        }
    }

    const handleDeleteList = async () => {
        if (!confirmDelete) return
        try {
            await deleteMutation.mutateAsync(confirmDelete._id)
            if (selectedListId === confirmDelete._id) setSelectedListId(null)
            setConfirmDelete(null)
        } catch (err) {
            alert('Error: ' + err.message)
        }
    }

    return (
        <div className="max-w-[1600px] mx-auto h-[calc(100vh-8rem)] flex flex-col">
            <div className="flex flex-1 gap-12 min-h-0">
                {/* Left Sidebar: List Container */}
                <div className="w-80 flex-shrink-0 flex flex-col pt-4 overflow-hidden">
                    <div className="px-6 mb-8">
                        <div className="flex items-center justify-between mb-8">
                            <h1 className="text-2xl font-black text-white tracking-tight">Listas</h1>
                            <button
                                onClick={() => setShowWizard(true)}
                                className="bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-xl text-sm font-bold transition-all flex items-center gap-2 shadow-lg shadow-indigo-500/20 active:scale-95"
                            >
                                <Plus size={18} />
                                <span>Añadir lista</span>
                            </button>
                        </div>

                        <div className="relative group/search">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500 group-focus-within/search:text-indigo-400 transition-colors" size={16} />
                            <input
                                placeholder="Buscar en"
                                value={listSearch}
                                onChange={e => setListSearch(e.target.value)}
                                className="w-full bg-white/5 border border-white/5 rounded-xl py-2.5 pl-10 pr-4 text-sm text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 transition-all font-medium"
                            />
                        </div>

                        <div className="mt-4 flex items-center justify-between px-1">
                            <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Ordenar por:</span>
                            <select
                                value={sortBy}
                                onChange={e => setSortBy(e.target.value)}
                                className="bg-transparent text-[11px] font-bold text-zinc-400 focus:outline-none cursor-pointer hover:text-white transition-colors"
                            >
                                <option value="newest">Recientes</option>
                                <option value="alpha">A-Z</option>
                            </select>
                        </div>
                    </div>

                    <div className="flex-1 overflow-y-auto px-4 space-y-1 custom-scrollbar">
                        <button
                            onClick={() => setSelectedListId(null)}
                            className={clsx(
                                "w-full flex items-center gap-3 px-4 py-3 rounded-2xl transition-all font-bold text-sm text-left group",
                                !selectedListId
                                    ? "bg-indigo-500/10 text-indigo-300 border border-indigo-500/20"
                                    : "text-zinc-500 hover:bg-white/5 hover:text-zinc-300"
                            )}
                        >
                            <div className={clsx(
                                "w-8 h-8 rounded-lg flex items-center justify-center text-sm font-black",
                                !selectedListId ? "bg-indigo-600 text-white shadow-lg shadow-indigo-500/40" : "bg-zinc-800 text-zinc-600 group-hover:bg-zinc-700"
                            )}>
                                <LayoutGrid size={16} />
                            </div>
                            <span className="flex-1">Todos los prospectos</span>
                        </button>

                        {filteredLists.map(l => (
                            <div key={l._id} className="relative group/list-item">
                                <button
                                    onClick={() => setSelectedListId(l._id)}
                                    className={clsx(
                                        "w-full flex items-center gap-3 px-4 py-3 rounded-2xl transition-all font-bold text-sm text-left",
                                        selectedListId === l._id
                                            ? "bg-indigo-500/10 text-indigo-300 border border-indigo-500/20"
                                            : "text-zinc-500 hover:bg-white/5 hover:text-zinc-300"
                                    )}
                                >
                                    <div className={clsx(
                                        "w-8 h-8 rounded-lg flex items-center justify-center text-xs font-black uppercase shadow-inner",
                                        selectedListId === l._id ? "bg-indigo-600 text-white shadow-lg shadow-indigo-500/40" : `bg-${['rose', 'blue', 'emerald', 'amber', 'purple'][Math.abs(l.name.length) % 5]}-500/20 text-${['rose', 'blue', 'emerald', 'amber', 'purple'][Math.abs(l.name.length) % 5]}-400`
                                    )}>
                                        {l.name[0]}
                                    </div>
                                    <span className="flex-1 truncate pr-6">{l.name}</span>
                                </button>
                                <button
                                    onClick={(e) => { e.stopPropagation(); setConfirmDelete(l); }}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 p-1.5 text-zinc-700 hover:text-red-400 opacity-0 group-hover/list-item:opacity-100 transition-all rounded-lg hover:bg-red-500/10"
                                >
                                    <Trash2 size={14} />
                                </button>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Center Content */}
                <div className="flex-1 flex flex-col min-w-0 pt-4 px-2">
                    <div className="mb-8 flex items-end justify-between">
                        <div className="flex items-center gap-3 bg-white/5 border border-white/10 px-6 py-3 rounded-3xl backdrop-blur-xl">
                            <span className="text-lg font-black text-white uppercase tracking-tighter">
                                {selectedList ? selectedList.name : 'Todos los prospectos'}
                            </span>
                            <div className="flex items-center gap-1.5 ml-4 pl-4 border-l border-white/10">
                                <Users size={16} className="text-indigo-400" />
                                <span className="text-sm font-black text-indigo-300 bg-indigo-500/10 px-3 py-1 rounded-xl shadow-inner">{tableLeads.length}</span>
                            </div>
                        </div>

                        {selectedList && (
                            <div className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest mb-1 mr-2 italic">
                                Sincronizado vía Waalaxy Engine
                            </div>
                        )}
                    </div>

                    <ProspectTable
                        leads={tableLeads}
                        selectedList={selectedList}
                        onRemove={handleRemoveFromList}
                        onAddClick={() => setShowAddModal(true)}
                        onSelectLead={setSelectedLead}
                    />
                </div>
            </div>

            <Wizard
                isOpen={showWizard}
                onClose={() => setShowWizard(false)}
                options={options}
                leads={leads}
                onCreate={handleCreateList}
            />

            <AddProspectModal
                isOpen={showAddModal}
                onClose={() => setShowAddModal(false)}
                leads={leads}
                currentProspects={selectedList?.prospects || []}
                onAdd={handleAddToList}
            />

            {confirmDelete && (
                <ConfirmModal
                    isOpen={!!confirmDelete}
                    title="Eliminar Lista"
                    message={`¿Estás seguro que deseas eliminar la lista "${confirmDelete.name}"? Esta acción no se puede deshacer.`}
                    onConfirm={handleDeleteList}
                    onCancel={() => setConfirmDelete(null)}
                    tone="danger"
                />
            )}

            {selectedLead && (
                <LeadDetailModal
                    lead={selectedLead}
                    isOpen={!!selectedLead}
                    onClose={() => setSelectedLead(null)}
                />
            )}
        </div>
    )
}

export default Lists
