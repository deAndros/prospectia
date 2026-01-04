import { ArrowUpDown } from 'lucide-react';
import clsx from 'clsx';
import DiscoveryResultRow from './DiscoveryResultRow';

const DiscoveryResultsTable = ({
    leads,
    selectedLeads,
    onToggleSelectAll,
    onToggleOne,
    onSelectLead,
    sortConfig,
    onSort,
    niche
}) => {
    const isAllSelected = selectedLeads.size === leads.length && leads.length > 0;

    return (
        <div className="bg-zinc-900/50 border border-white/10 rounded-lg overflow-hidden overflow-x-auto">
            <table className="w-full text-left text-sm">
                <thead className="bg-gradient-to-r from-zinc-800/80 to-zinc-800/50 border-b border-white/10">
                    <tr>
                        <th className="px-4 py-4 w-12">
                            <input
                                type="checkbox"
                                checked={isAllSelected}
                                onChange={onToggleSelectAll}
                                className="rounded border-zinc-700 bg-zinc-800 text-indigo-600 focus:ring-indigo-500"
                            />
                        </th>
                        <th
                            className="px-6 py-4 cursor-pointer hover:text-white transition-colors group"
                            onClick={() => onSort('name')}
                        >
                            <div className="flex items-center gap-2 font-semibold text-white text-sm">
                                🏢 Organización
                                <ArrowUpDown
                                    size={14}
                                    className={clsx(
                                        'transition-opacity',
                                        sortConfig.key === 'name'
                                            ? 'opacity-100'
                                            : 'opacity-0 group-hover:opacity-50'
                                    )}
                                />
                            </div>
                        </th>
                        <th
                            className="px-6 py-4 cursor-pointer hover:text-white transition-colors group"
                            onClick={() => onSort('type')}
                        >
                            <div className="flex items-center gap-2 font-semibold text-white text-sm">
                                📋 Tipo
                                <ArrowUpDown
                                    size={14}
                                    className={clsx(
                                        'transition-opacity',
                                        sortConfig.key === 'type'
                                            ? 'opacity-100'
                                            : 'opacity-0 group-hover:opacity-50'
                                    )}
                                />
                            </div>
                        </th>
                        <th
                            className="px-6 py-4 cursor-pointer hover:text-white transition-colors group min-w-[180px]"
                            onClick={() => onSort('social')}
                        >
                            <div className="flex items-center gap-2 font-semibold text-white text-sm whitespace-nowrap">
                                👥 Redes Sociales
                                <ArrowUpDown
                                    size={14}
                                    className={clsx(
                                        'transition-opacity',
                                        sortConfig.key === 'social'
                                            ? 'opacity-100'
                                            : 'opacity-0 group-hover:opacity-50'
                                    )}
                                />
                            </div>
                        </th>
                        <th className="px-6 py-4 max-w-[200px]">
                            <div className="font-semibold text-white text-sm">
                                💡 Señales
                            </div>
                        </th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                    {leads.map((lead) => (
                        <DiscoveryResultRow
                            key={lead.url}
                            lead={lead}
                            isSelected={selectedLeads.has(lead.url)}
                            onToggle={onToggleOne}
                            onClick={onSelectLead}
                            niche={niche}
                        />
                    ))}
                </tbody>
            </table>
            {leads.length === 0 && (
                <div className="p-12 text-center text-zinc-500">
                    No hay resultados para mostrar con los filtros actuales.
                </div>
            )}
        </div>
    );
};

export default DiscoveryResultsTable;
