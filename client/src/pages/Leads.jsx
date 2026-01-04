import { useState, useMemo } from 'react';
import { Search, AlertCircle } from 'lucide-react';
import { useLeads, useAnalyzeLead } from '../hooks/leadHooks';
import { useLists } from '../hooks/listHooks';

import { motion, AnimatePresence } from 'framer-motion';
import LeadDetailModal from '../components/LeadDetailModal';

// Modular Components
import LeadsHeader from '../components/Leads/LeadsHeader';
import LeadsFilterBar from '../components/Leads/LeadsFilterBar';
import LeadsGrid from '../components/Leads/LeadsGrid';
import LeadsList from '../components/Leads/LeadsList';

const MotionDiv = motion.div;

const Leads = () => {
    const { data: leads = [] } = useLeads();
    const { data: lists = [] } = useLists();
    const { mutateAsync: analyzeLead } = useAnalyzeLead();

    const [selectedLead, setSelectedLead] = useState(null);
    const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'list'
    const [analysisError, setAnalysisError] = useState(null);

    // Filters
    const [searchTerm, setSearchTerm] = useState('');
    const [countryFilter, setCountryFilter] = useState('');
    const [nicheFilter, setNicheFilter] = useState('');

    const [localAnalyzingId, setLocalAnalyzingId] = useState(null);

    const handleAnalyzeImproved = async (e, lead) => {
        e.stopPropagation();
        setLocalAnalyzingId(lead._id);
        setAnalysisError(null);
        try {
            await analyzeLead(lead._id);
        } catch (error) {
            setAnalysisError(error.message || 'No se pudo completar el análisis automáticamente.');
        } finally {
            setLocalAnalyzingId(null);
        }
    };

    const filteredLeads = useMemo(() => {
        let result = leads;

        if (searchTerm) {
            result = result.filter(l => l.name.toLowerCase().includes(searchTerm.toLowerCase()));
        }

        if (countryFilter) {
            result = result.filter(l => l.country === countryFilter);
        }

        if (nicheFilter) {
            result = result.filter(l => l.niche === nicheFilter);
        }

        return result;
    }, [leads, searchTerm, countryFilter, nicheFilter]);

    return (
        <div className="space-y-6 max-w-7xl mx-auto">
            <AnimatePresence>
                {analysisError && (
                    <MotionDiv
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="bg-red-500/10 border border-red-500/20 text-red-300 p-4 rounded-xl flex items-start gap-3 backdrop-blur-sm"
                    >
                        <AlertCircle size={18} className="mt-0.5 text-red-400" />
                        <div className="flex-1">
                            <div className="font-semibold">No se pudo calcular el score</div>
                            <div className="text-sm text-red-200/90 mt-1">{analysisError}</div>
                        </div>
                        <button
                            type="button"
                            onClick={() => setAnalysisError(null)}
                            className="text-red-200/80 hover:text-white text-sm font-semibold"
                        >
                            Cerrar
                        </button>
                    </MotionDiv>
                )}
            </AnimatePresence>

            <LeadsHeader viewMode={viewMode} setViewMode={setViewMode} />

            {/* Premium Frame Container */}
            <div className="bg-zinc-900/40 backdrop-blur-md border border-white/10 rounded-2xl p-6 shadow-2xl relative overflow-hidden">
                {/* Decorative gradients for the frame */}
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-indigo-500/50 to-transparent opacity-50"></div>

                <LeadsFilterBar
                    searchTerm={searchTerm}
                    setSearchTerm={setSearchTerm}
                    countryFilter={countryFilter}
                    setCountryFilter={setCountryFilter}
                    nicheFilter={nicheFilter}
                    setNicheFilter={setNicheFilter}
                />

                {/* Results */}
                <AnimatePresence mode="wait">
                    {viewMode === 'grid' ? (
                        <LeadsGrid
                            leads={filteredLeads}
                            onSelectLead={setSelectedLead}
                            onAnalyze={handleAnalyzeImproved}
                            analyzingId={localAnalyzingId}
                            lists={lists}
                        />
                    ) : (
                        <LeadsList
                            leads={filteredLeads}
                            onSelectLead={setSelectedLead}
                            lists={lists}
                        />
                    )}
                </AnimatePresence>

                {filteredLeads.length === 0 && (
                    <div className="flex flex-col items-center justify-center py-24 text-center bg-zinc-900/40 backdrop-blur-sm rounded-2xl border border-white/5 border-dashed">
                        <div className="bg-zinc-800/50 p-4 rounded-full mb-4 ring-1 ring-white/10 shadow-xl">
                            <Search className="text-zinc-500" size={32} />
                        </div>
                        <h3 className="text-xl font-bold text-white mb-2">No se encontraron resultados</h3>
                        <p className="text-zinc-400 max-w-sm mx-auto mb-6">
                            No hay prospectos que coincidan con los filtros aplicados. Intenta con otros términos o limpia la búsqueda.
                        </p>
                        <button
                            onClick={() => {
                                setSearchTerm('');
                                setCountryFilter('');
                                setNicheFilter('');
                            }}
                            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium rounded-lg transition-colors shadow-lg shadow-indigo-500/20"
                        >
                            Limpiar filtros
                        </button>
                    </div>
                )}
            </div>

            {/* Lead Detail Modal */}
            <LeadDetailModal
                isOpen={!!selectedLead}
                lead={selectedLead}
                onClose={() => setSelectedLead(null)}
                onUpdate={() => {
                    setSelectedLead(null);
                }}
            />
        </div>
    );
};

export default Leads;
