import { LayoutGrid, List as ListIcon } from 'lucide-react';
import clsx from 'clsx';

const LeadsHeader = ({ viewMode, setViewMode }) => {
    return (
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
    );
};

export default LeadsHeader;
