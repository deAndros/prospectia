import clsx from 'clsx';

const DiscoveryResultRow = ({ lead, isSelected, onToggle, onClick, niche }) => {
    return (
        <tr
            key={lead.url}
            className={clsx(
                'transition-colors',
                isSelected
                    ? 'bg-indigo-500/10 hover:bg-indigo-500/15'
                    : 'hover:bg-white/5'
            )}
        >
            <td className="px-4 py-4">
                <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={() => onToggle(lead.url)}
                    onClick={(e) => e.stopPropagation()}
                    className="rounded border-zinc-700 bg-zinc-800 text-indigo-600 focus:ring-indigo-500 cursor-pointer relative z-20"
                />
            </td>
            {/* Celdas clickeables */}
            <td
                className="px-6 py-4 cursor-pointer"
                onClick={() => onClick(lead)}
            >
                <div className="font-semibold text-white">
                    {lead.name}
                </div>
                <a
                    href={lead.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-indigo-400 hover:text-indigo-300 hover:underline text-xs truncate max-w-[250px] block mt-1 transition-colors relative z-20"
                    onClick={(e) => e.stopPropagation()}
                >
                    {lead.url}
                </a>
                <div className="text-xs text-zinc-600 mt-1">{niche}</div>
            </td>
            <td
                className="px-6 py-4 text-zinc-300 cursor-pointer"
                onClick={() => onClick(lead)}
            >
                {lead.type}
            </td>
            <td
                className="px-6 py-4 cursor-pointer"
                onClick={() => onClick(lead)}
            >
                {lead.social_media && lead.social_media.length > 0 ? (
                    <div className="space-y-1.5">
                        {lead.social_media.map((social, idx) => (
                            <div key={idx} className="flex items-center gap-2">
                                <a
                                    href={social.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-indigo-400 hover:text-indigo-300 font-medium text-xs hover:underline transition-colors relative z-20"
                                    onClick={(e) => e.stopPropagation()}
                                >
                                    {social.network}
                                </a>
                                <span className="text-zinc-500 text-xs">:</span>
                                <span className="text-zinc-400 text-xs font-mono">
                                    {social.followers}
                                </span>
                            </div>
                        ))}
                    </div>
                ) : (
                    <span className="text-zinc-600 text-xs italic">
                        No disponible
                    </span>
                )}
            </td>
            <td
                className="px-6 py-4 cursor-pointer"
                onClick={() => onClick(lead)}
            >
                <div className="flex flex-wrap gap-1.5">
                    {Array.isArray(lead.signals) &&
                        lead.signals.slice(0, 2).map((signal, i) => (
                            <span
                                key={i}
                                className="px-2.5 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-md text-xs text-emerald-300"
                            >
                                {signal}
                            </span>
                        ))}
                </div>
            </td>
        </tr>
    );
};

export default DiscoveryResultRow;
