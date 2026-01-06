import { useMemo, useState, useEffect } from 'react'
import { Search, Plus, ChevronLeft, ChevronRight, Users, Briefcase, LayoutGrid, List as ListIcon, ArrowUpDown } from 'lucide-react'
import clsx from 'clsx'
import { useAnalyzeLead } from '../../hooks/leadHooks'
import CountrySelector from '../CountrySelector'
import NicheSelector from '../NicheSelector'
import ProspectTableRow from './ProspectTableRow'
import LeadsGrid from '../Leads/LeadsGrid'

const ProspectTable = ({ leads, selectedList, lists, onRemove, onDelete, onAddClick, onSelectLead }) => {
    const [viewMode, setViewMode] = useState('table') // 'table' | 'grid'
    const [search, setSearch] = useState('')
    const [countryFilter, setCountryFilter] = useState('')
    const [nicheFilter, setNicheFilter] = useState('')
    const [currentPage, setCurrentPage] = useState(1)
    const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' })
    const pageSize = 10

    const { mutateAsync: analyzeLead } = useAnalyzeLead()
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

    // Reiniciar a la página 1 cuando cambie cualquier filtro u orden
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
                    {/* Mini UI de Paginación en la parte superior */}
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

                    {/* Alternar vista */}
                    <div className="flex bg-white/5 p-1 rounded-2xl border border-white/10 h-[50px]">
                        <button
                            onClick={() => setViewMode('table')}
                            className={clsx(
                                "px-3 rounded-xl transition-all flex items-center justify-center",
                                viewMode === 'table' ? "bg-indigo-600 text-white shadow-lg shadow-indigo-500/20" : "text-zinc-500 hover:text-white"
                            )}
                            title="Vista de Tabla"
                        >
                            <ListIcon size={20} />
                        </button>
                        <button
                            onClick={() => setViewMode('grid')}
                            className={clsx(
                                "px-3 rounded-xl transition-all flex items-center justify-center",
                                viewMode === 'grid' ? "bg-indigo-600 text-white shadow-lg shadow-indigo-500/20" : "text-zinc-500 hover:text-white"
                            )}
                            title="Vista de Tarjetas"
                        >
                            <LayoutGrid size={20} />
                        </button>
                    </div>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto custom-scrollbar">
                {viewMode === 'table' ? (
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
                                <ProspectTableRow
                                    key={lead._id}
                                    lead={lead}
                                    selectedList={selectedList}
                                    onSelectLead={onSelectLead}
                                    onRemove={onRemove}
                                    onDelete={onDelete}
                                    onAnalyze={handleAnalyze}
                                    analyzingId={analyzingId}
                                />
                            ))}
                        </tbody>
                    </table>
                ) : (
                    <div className="pt-2">
                        <LeadsGrid
                            leads={paginatedLeads}
                            onSelectLead={onSelectLead}
                            onAnalyze={handleAnalyze}
                            analyzingId={analyzingId}
                            lists={lists}
                        />
                    </div>
                )}

                {paginatedLeads.length === 0 && (
                    <div className="py-20 text-center">
                        <div className="flex flex-col items-center gap-3">
                            <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center text-zinc-600">
                                <Search size={32} />
                            </div>
                            <div>
                                <p className="text-white font-bold">No se encontraron prospectos</p>
                                <p className="text-zinc-500 text-sm">Intenta ajustar tus términos de búsqueda.</p>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Controles principales de paginación en la parte inferior */}
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

export default ProspectTable
