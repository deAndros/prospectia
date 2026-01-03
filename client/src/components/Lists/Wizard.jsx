import { useState, useEffect } from 'react'
import { Plus, Check, X, Users } from 'lucide-react'
import clsx from 'clsx'

const STEPS = [
    { id: 1, title: 'Países', description: 'Filtra por ubicación' },
    { id: 2, title: 'Rubros', description: 'Filtra por industria' },
    { id: 3, title: 'Score', description: 'Filtra por calidad' },
]

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

export default Wizard
