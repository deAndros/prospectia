import { motion } from 'framer-motion';
import LeadCard from './LeadCard';

const MotionDiv = motion.div;

const LeadsGrid = ({ leads, onSelectLead, onAnalyze, analyzingId, lists }) => {
    return (
        <MotionDiv
            key="grid"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-fr"
        >
            {leads.map(lead => (
                <LeadCard
                    key={lead._id}
                    lead={lead}
                    onClick={onSelectLead}
                    onAnalyze={onAnalyze}
                    analyzingId={analyzingId}
                    lists={lists}
                />
            ))}
        </MotionDiv>
    );
};

export default LeadsGrid;
