import { useState, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useUpdateLead, useDeleteLead } from '../hooks/useLeads'
import HeaderActions from './LeadDetail/HeaderActions'
import DeleteConfirm from './LeadDetail/DeleteConfirm'
import LeadEditForm from './LeadDetail/LeadEditForm'
import LeadSummary from './LeadDetail/LeadSummary'
import ScoreBreakdown from './LeadDetail/ScoreBreakdown'
import SocialMediaList from './LeadDetail/SocialMediaList'
import SignalsList from './LeadDetail/SignalsList'
import NotesSection from './LeadDetail/NotesSection'

const MotionDiv = motion.div

const EMPTY_FORM = {
  name: '',
  country: '',
  niche: '',
  type: '',
  url: '',
  notes: '',
}

const LeadDetailModal = ({ lead, isOpen, onClose, onUpdate }) => {
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState(EMPTY_FORM)
  const [deleteConfirm, setDeleteConfirm] = useState(false)

  // Mutations
  const { mutateAsync: updateLead, isPending: isUpdating } = useUpdateLead()

  const { mutateAsync: deleteLead, isPending: isDeleting } = useDeleteLead()

  const isLoading = isUpdating || isDeleting

  useEffect(() => {
    if (lead) {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- rehidrata el form al cambiar de lead
      setFormData({
        name: lead.name || '',
        country: lead.country || '',
        niche: lead.niche || '',
        type: lead.type || '',
        url: lead.url || '',
        notes: lead.notes || '',
      })
      setIsEditing(false)
      setDeleteConfirm(false)
    } else {
      setFormData(EMPTY_FORM)
      setIsEditing(false)
      setDeleteConfirm(false)
    }
  }, [lead])

  if (!isOpen && !lead) return null

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSave = async () => {
    try {
      await updateLead({ id: lead._id, data: formData })
      if (onUpdate) onUpdate() // Notify parent if needed (e.g. for closing selection)
      setIsEditing(false)
    } catch (error) {
      alert('Error al actualizar el prospecto: ' + (error.message || ''))
    }
  }

  const handleDelete = async () => {
    try {
      await deleteLead(lead._id)
      if (onUpdate) onUpdate()
      onClose() // Close modal on delete
    } catch (error) {
      alert('Error al eliminar el prospecto: ' + (error.message || ''))
    }
  }

  return createPortal(
    <AnimatePresence>
      {isOpen && lead && (
        <MotionDiv
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
          onClick={onClose}
        >
          <MotionDiv
            initial={{ scale: 0.95, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 20 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-zinc-900 border border-white/10 w-full max-w-2xl rounded-2xl overflow-hidden shadow-2xl relative flex flex-col max-h-[90vh]"
          >
            {/* Header Banner - Slightly taller */}
            <div className="absolute top-0 left-0 right-0 h-40 bg-gradient-to-br from-indigo-900/40 via-purple-900/30 to-black/0 pointer-events-none" />

            <HeaderActions
              isEditing={isEditing}
              deleteConfirm={deleteConfirm}
              onDeleteClick={() => setDeleteConfirm(true)}
              onEditClick={() => setIsEditing(true)}
              onClose={onClose}
            />

            {/* Delete Confirmation Overlay (Unchanged logic, just keeping structure) */}
            {deleteConfirm && (
              <DeleteConfirm
                onCancel={() => setDeleteConfirm(false)}
                onConfirm={handleDelete}
                isLoading={isLoading}
              />
            )}

            {/* Main Content */}
            <div className="relative z-10 px-8 pt-12 pb-8 overflow-y-auto custom-scrollbar flex flex-col h-full">
              {/* Header Section */}
              <div className="mb-8 mt-4">
                {' '}
                {/* Added mt-4 to push down from banner edge */}
                {isEditing ? (
                  <LeadEditForm
                    formData={formData}
                    onChange={handleInputChange}
                    onSave={handleSave}
                    onCancel={() => setIsEditing(false)}
                    isLoading={isLoading}
                  />
                ) : (
                  <LeadSummary lead={lead} />
                )}
              </div>

              {/* Score Breakdown Section */}
              <ScoreBreakdown
                scoring={lead.scoring}
                enrichment={lead.enrichment}
              />

              {/* Details Grid - Better Spacing */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-6 border-t border-white/5 mt-auto">
                <SocialMediaList socialMedia={lead.social_media} />
                <SignalsList signals={lead.signals} />
              </div>

              <NotesSection notes={lead.notes} />
            </div>
          </MotionDiv>
        </MotionDiv>
      )}
    </AnimatePresence>,
    document.body
  )
}

export default LeadDetailModal
