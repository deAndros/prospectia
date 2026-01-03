import { Search, Plus, Trash2, LayoutGrid } from 'lucide-react'
import clsx from 'clsx'

const ListsSidebar = ({
    lists,
    selectedListId,
    listSearch,
    setListSearch,
    sortBy,
    setSortBy,
    onAddList,
    onSelectList,
    onDeleteList,
    filteredLists
}) => {
    return (
        <div className="w-80 flex-shrink-0 flex flex-col pt-4 overflow-hidden">
            <div className="px-6 mb-8">
                <div className="flex items-center justify-between mb-8">
                    <h1 className="text-2xl font-black text-white tracking-tight">Listas</h1>
                    <button
                        onClick={onAddList}
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
                    onClick={() => onSelectList(null)}
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
                            onClick={() => onSelectList(l._id)}
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
                            onClick={(e) => { e.stopPropagation(); onDeleteList(l); }}
                            className="absolute right-4 top-1/2 -translate-y-1/2 p-1.5 text-zinc-700 hover:text-red-400 opacity-0 group-hover/list-item:opacity-100 transition-all rounded-lg hover:bg-red-500/10"
                        >
                            <Trash2 size={14} />
                        </button>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default ListsSidebar
