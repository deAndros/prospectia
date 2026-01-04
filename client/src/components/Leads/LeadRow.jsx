const isNew = (dateString) => {
    if (!dateString) return false;
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays <= 7;
};

const LeadRow = ({ lead, onClick, lists }) => {
    const leadLists = lists.filter(l => (l.prospects || []).includes(lead._id));

    return (
        <tr
            key={lead._id}
            onClick={() => onClick(lead)}
            className="hover:bg-white/5 transition-colors cursor-pointer group"
        >
            <td className="px-6 py-4">
                <div className="flex items-center gap-3">
                    <div>
                        <div className="flex items-center gap-2">
                            <span className="font-medium text-white group-hover:text-indigo-400 transition-colors">
                                {lead.name}
                            </span>
                            {isNew(lead.createdAt) && (
                                <span className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse"></span>
                            )}
                        </div>
                        <div className="text-xs text-zinc-500">{lead.type}</div>
                    </div>
                </div>
            </td>
            <td className="px-6 py-4">
                <div className="flex items-center gap-2 text-sm text-zinc-300">
                    <span className="text-xl">{lead.country === 'Argentina' ? '🇦🇷' : lead.country === 'España' ? '🇪🇸' : '🌍'}</span>
                    <span>{lead.country}</span>
                </div>
            </td>
            <td className="px-6 py-4 text-sm text-zinc-300">
                {lead.niche}
            </td>
            <td className="px-6 py-4">
                <div className="flex flex-wrap gap-1 max-w-[200px]">
                    {leadLists.map(l => (
                        <span key={l._id} className="px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 text-[9px] font-bold uppercase overflow-hidden text-ellipsis whitespace-nowrap">
                            {l.name}
                        </span>
                    ))}
                    {leadLists.length === 0 && (
                        <span className="text-zinc-600 text-[10px]">—</span>
                    )}
                </div>
            </td>
            <td className="px-6 py-4">
                <span className="inline-flex px-2 py-1 rounded text-xs font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    {lead.status}
                </span>
            </td>
            <td className="px-6 py-4 text-right text-sm text-zinc-500">
                {new Date(lead.createdAt).toLocaleDateString()}
            </td>
        </tr>
    );
};

export default LeadRow;
