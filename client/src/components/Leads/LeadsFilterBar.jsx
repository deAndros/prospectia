import { Search } from 'lucide-react';
import CountrySelector from '../CountrySelector';
import NicheSelector from '../NicheSelector';

const LeadsFilterBar = ({ searchTerm, setSearchTerm, countryFilter, setCountryFilter, nicheFilter, setNicheFilter }) => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="relative z-30">
                <label className="block text-sm font-medium text-zinc-400 mb-1.5 ml-1">Buscar</label>
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" size={16} />
                    <input
                        type="text"
                        placeholder="Buscar por nombre..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full h-[50px] bg-black/40 border border-white/10 rounded-xl pl-10 pr-4 text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all shadow-inner"
                    />
                </div>
            </div>
            <div className="relative z-30">
                <label className="block text-sm font-medium text-zinc-400 mb-1.5 ml-1">País</label>
                <CountrySelector value={countryFilter} onChange={setCountryFilter} />
            </div>
            <div className="relative z-30">
                <label className="block text-sm font-medium text-zinc-400 mb-1.5 ml-1">Rubro</label>
                <NicheSelector value={nicheFilter} onChange={setNicheFilter} />
            </div>
        </div>
    );
};

export default LeadsFilterBar;
