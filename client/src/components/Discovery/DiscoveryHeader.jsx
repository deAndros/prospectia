import { Sparkles, Info } from 'lucide-react';

const DiscoveryHeader = () => {
    return (
        <div className="relative">
            {/* Blobs decorativos sutiles */}
            <div className="absolute -top-32 -left-32 w-80 h-80 bg-indigo-500/20 rounded-full blur-[120px] pointer-events-none"></div>
            <div className="absolute -top-32 -right-32 w-80 h-80 bg-purple-500/15 rounded-full blur-[120px] pointer-events-none"></div>

            <div className="relative z-10 space-y-4">
                <div className="flex items-center gap-3">
                    <h2 className="text-4xl font-bold text-white tracking-tight">
                        Descubrimiento de Prospectos
                    </h2>
                    <Sparkles className="text-indigo-400" size={28} />
                </div>

                {/* Bloque informativo destacado */}
                <div className="bg-indigo-500/10 border border-indigo-500/20 rounded-lg p-4 backdrop-blur-sm">
                    <div className="flex gap-3">
                        <div className="shrink-0">
                            <Info className="text-indigo-400" size={20} />
                        </div>
                        <div>
                            <p className="text-zinc-200 text-sm leading-relaxed mb-1.5">
                                Utiliza inteligencia artificial para encontrar socios
                                estratégicos potenciales en tiempo real.
                            </p>
                            <p className="text-zinc-400 text-xs leading-relaxed">
                                Define tu mercado objetivo y el rubro de interés, y obtén una
                                lista curada de prospectos relevantes con información clave
                                para tu análisis.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DiscoveryHeader;
