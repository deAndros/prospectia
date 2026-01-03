import { useState, useEffect } from 'react'
import { Search, Check, X } from 'lucide-react'
import clsx from 'clsx'

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

export default AddProspectModal
