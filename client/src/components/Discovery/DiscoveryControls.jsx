import { Search, Trash2, Save, Loader2 } from 'lucide-react';

const DiscoveryControls = ({
    filterText,
    setFilterText,
    displayedCount,
    totalCount,
    selectedCount,
    onClear,
    onSave,
    saving
}) => {
    return (
        <div className="flex flex-col md:flex-row gap-3 justify-between items-center bg-zinc-900/50 p-4 rounded-lg border border-white/10">
            <div className="flex flex-col md:flex-row gap-3 w-full md:w-auto">
                <div className="relative w-full md:w-64">
                    <Search
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500"
                        size={16}
                    />
                    <input
                        type="text"
                        placeholder="Filtrar por nombre..."
                        value={filterText}
                        onChange={(e) => setFilterText(e.target.value)}
                        className="w-full bg-black/40 border border-white/10 rounded-lg pl-9 pr-4 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                    />
                </div>
            </div>
            <div className="flex items-center gap-3 w-full md:w-auto">
                <span className="text-zinc-400 text-sm">
                    {displayedCount} de {totalCount} • {selectedCount}{' '}
                    seleccionados
                </span>
                <button
                    onClick={onClear}
                    type="button"
                    className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 px-5 py-2 rounded-lg font-medium transition-colors border border-white/10"
                    title="Limpiar resultados"
                >
                    <Trash2 size={16} />
                    Limpiar
                </button>
                <button
                    onClick={onSave}
                    disabled={saving || selectedCount === 0}
                    className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white px-5 py-2 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {saving ? (
                        <Loader2 className="animate-spin" size={16} />
                    ) : (
                        <Save size={16} />
                    )}
                    Guardar Seleccionados
                </button>
            </div>
        </div>
    );
};

export default DiscoveryControls;
