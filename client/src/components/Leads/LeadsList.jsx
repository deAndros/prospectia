import { motion } from 'framer-motion';
import LeadRow from './LeadRow';

const MotionDiv = motion.div;

const LeadsList = ({ leads, onSelectLead, lists }) => {
    return (
        <MotionDiv
            key="list"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="bg-black/20 border border-white/5 rounded-xl overflow-hidden shadow-xl"
        >
            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-white/5 border-b border-white/5 text-xs uppercase tracking-wider text-zinc-400">
                            <th className="px-6 py-4 font-medium">Organización</th>
                            <th className="px-6 py-4 font-medium">Ubicación</th>
                            <th className="px-6 py-4 font-medium">Rubro</th>
                            <th className="px-6 py-4 font-medium">Listas</th>
                            <th className="px-6 py-4 font-medium">Estado</th>
                            <th className="px-6 py-4 font-medium text-right">Fecha</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                        {leads.map(lead => (
                            <LeadRow
                                key={lead._id}
                                lead={lead}
                                onClick={onSelectLead}
                                lists={lists}
                            />
                        ))}
                    </tbody>
                </table>
            </div>
        </MotionDiv>
    );
};

export default LeadsList;
