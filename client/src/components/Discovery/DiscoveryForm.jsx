import { Search, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';
import CountrySelector from '../CountrySelector';
import NicheSelector from '../NicheSelector';

const MotionForm = motion.form;

const DiscoveryForm = ({
    country,
    setCountry,
    niche,
    setNiche,
    maxResults,
    setMaxResults,
    showOnlyWithSocial,
    setShowOnlyWithSocial,
    onSearch,
    loading
}) => {
    return (
        <MotionForm
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            onSubmit={onSearch}
            className="relative z-20 bg-zinc-900/60 backdrop-blur-md border border-white/10 p-6 rounded-xl"
        >
            {/* Gradiente de fondo sutil */}
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-purple-500/5 pointer-events-none"></div>

            <div className="relative z-20 space-y-6">
                {/* Inputs principales en una fila */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <label className="block text-sm font-medium text-zinc-200">
                            País Objetivo
                        </label>
                        <CountrySelector value={country} onChange={setCountry} />
                    </div>
                    <div className="space-y-2">
                        <label className="block text-sm font-medium text-zinc-200">
                            Rubro o Industria
                        </label>
                        <NicheSelector value={niche} onChange={setNiche} />
                    </div>
                </div>

                {/* Cantidad, filtro y botón */}
                <div className="flex flex-col md:flex-row gap-4 md:items-end">
                    <div className="w-full md:w-auto bg-black/40 border border-white/10 rounded-xl px-4 py-3 hover:bg-black/60 transition-colors select-none">
                        <div className="flex items-center justify-between gap-4">
                            <div className="min-w-0 flex items-center gap-2">
                                <div className="text-sm font-semibold text-zinc-200 leading-tight whitespace-nowrap">
                                    Cantidad
                                </div>
                                <span
                                    className="inline-flex items-center justify-center w-5 h-5 rounded-full border border-white/10 bg-white/5 text-zinc-300 text-[11px] leading-none"
                                    title="Cantidad máxima de prospectos a buscar, la IA puede no encontrar el número exacto ingresado."
                                    aria-label="Ayuda: cantidad de prospectos"
                                >
                                    i
                                </span>
                            </div>

                            <div className="shrink-0">
                                <input
                                    type="number"
                                    min="1"
                                    max="30"
                                    value={maxResults}
                                    onChange={(e) => setMaxResults(e.target.value)}
                                    placeholder="1–30"
                                    inputMode="numeric"
                                    className="w-20 h-6 bg-black/30 border border-white/10 rounded-lg px-3 text-sm text-white text-center leading-6 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 transition-all placeholder:text-zinc-600"
                                    aria-label="Cantidad de prospectos"
                                />
                            </div>
                        </div>
                    </div>

                    <label className="w-full md:w-auto bg-black/40 border border-white/10 rounded-xl px-4 py-3 hover:bg-black/60 transition-colors cursor-pointer select-none">
                        <div className="flex items-center justify-between gap-4">
                            <div className="min-w-0 flex items-center gap-2">
                                <div className="text-sm font-semibold text-zinc-200 leading-tight whitespace-nowrap">
                                    Con redes
                                </div>
                                <span
                                    className="inline-flex items-center justify-center w-5 h-5 rounded-full border border-white/10 bg-white/5 text-zinc-300 text-[11px] leading-none"
                                    title="Excluye prospectos que no tengan al menos una URL válida en sus redes sociales."
                                    aria-label="Ayuda: filtro por redes sociales"
                                >
                                    i
                                </span>
                            </div>

                            <div className="shrink-0">
                                <input
                                    type="checkbox"
                                    checked={showOnlyWithSocial}
                                    onChange={(e) => setShowOnlyWithSocial(e.target.checked)}
                                    className="sr-only peer"
                                    aria-label="Filtrar solo prospectos con redes sociales"
                                />
                                <div className="relative w-11 h-6 rounded-full bg-zinc-700/80 border border-white/10 peer-checked:bg-indigo-600/90 peer-checked:border-indigo-500/40 transition-colors after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:w-5 after:h-5 after:rounded-full after:bg-white/90 after:shadow-md after:shadow-black/30 after:transition-transform peer-checked:after:translate-x-5" />
                            </div>
                        </div>
                    </label>

                    <div className="w-full md:flex-1 flex md:justify-end">
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full md:w-auto md:self-end inline-flex items-center justify-center gap-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white px-8 py-3 rounded-lg font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-indigo-500/20"
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="animate-spin" size={18} />
                                    Buscando...
                                </>
                            ) : (
                                <>
                                    <Search size={18} />
                                    Buscar Prospectos
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </MotionForm>
    );
};

export default DiscoveryForm;
