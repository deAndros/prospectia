import { useState, useEffect } from 'react'
import { createPortal } from 'react-dom'
import {
  X,
  Globe,
  Users,
  Target,
  ExternalLink,
  MapPin,
  Briefcase,
  Edit2,
  Trash2,
  Save,
  AlertCircle,
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useUpdateLead, useDeleteLead } from '../hooks/useLeads'
import clsx from 'clsx'

const MotionDiv = motion.div

const LeadDetailModal = ({ lead, isOpen, onClose, onUpdate }) => {
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState({})
  const [deleteConfirm, setDeleteConfirm] = useState(false)

  // Mutations
  const {
    mutateAsync: updateLead,
    isPending: isUpdating
  } = useUpdateLead();

  const {
    mutateAsync: deleteLead,
    isPending: isDeleting
  } = useDeleteLead();

  const isLoading = isUpdating || isDeleting;

  useEffect(() => {
    if (lead) {
      setFormData({
        name: lead.name,
        country: lead.country,
        niche: lead.niche,
        type: lead.type,
        url: lead.url,
        notes: lead.notes || '',
      })
      setIsEditing(false)
      setDeleteConfirm(false)
    }
  }, [lead])

  // REMOVED early return: if (!lead) return null;
  // We handle it in the render to allow exit animations and proper isOpen usage
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

  // Helper to get brand styles
  const getSocialStyle = (network) => {
    const n = network.toLowerCase()
    if (n.includes('linkedin'))
      return {
        icon: <Users size={18} />,
        color: 'text-[#0077b5]',
        bg: 'bg-[#0077b5]/10',
        border: 'border-[#0077b5]/20',
        hover: 'hover:border-[#0077b5]/50 hover:bg-[#0077b5]/20',
      }
    if (n.includes('twitter') || n.includes('x'))
      return {
        icon: <Users size={18} />,
        color: 'text-white',
        bg: 'bg-white/5',
        border: 'border-white/10',
        hover: 'hover:border-white/30 hover:bg-white/10',
      }
    if (n.includes('instagram'))
      return {
        icon: <Users size={18} />,
        color: 'text-pink-500',
        bg: 'bg-pink-500/10',
        border: 'border-pink-500/20',
        hover: 'hover:border-pink-500/50 hover:bg-pink-500/20',
      }
    if (n.includes('facebook'))
      return {
        icon: <Users size={18} />,
        color: 'text-[#1877f2]',
        bg: 'bg-[#1877f2]/10',
        border: 'border-[#1877f2]/20',
        hover: 'hover:border-[#1877f2]/50 hover:bg-[#1877f2]/20',
      }
    return {
      icon: <Globe size={18} />,
      color: 'text-indigo-400',
      bg: 'bg-indigo-500/10',
      border: 'border-indigo-500/20',
      hover: 'hover:border-indigo-500/50 hover:bg-indigo-500/20',
    }
  }

  const getScoreTone = (score100) => {
    const s = Number(score100) || 0
    if (s >= 80)
      return {
        label: 'Potencial alto',
        badge:
          'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
        glow: 'bg-emerald-500',
        text: 'text-emerald-300',
      }
    if (s >= 60)
      return {
        label: 'Potencial medio',
        badge: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
        glow: 'bg-blue-500',
        text: 'text-blue-300',
      }
    if (s >= 40)
      return {
        label: 'Potencial bajo',
        badge: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
        glow: 'bg-amber-500',
        text: 'text-amber-300',
      }
    return {
      label: 'Potencial muy bajo',
      badge: 'bg-zinc-500/10 text-zinc-400 border-zinc-500/20',
      glow: 'bg-zinc-500',
      text: 'text-zinc-300',
    }
  }

  const getRecommendationTone = (rec) => {
    if (rec === 'Contacto prioritario')
      return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
    if (rec === 'Revisar')
      return 'bg-amber-500/10 text-amber-400 border-amber-500/20'
    if (rec === 'Descartar')
      return 'bg-zinc-500/10 text-zinc-400 border-zinc-500/20'
    return 'bg-white/5 text-zinc-300 border-white/10'
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

            {/* Navbar Actions */}
            <div className="absolute top-4 right-4 z-20 flex gap-2">
              {!isEditing && !deleteConfirm && (
                <>
                  <button
                    onClick={() => setDeleteConfirm(true)}
                    className="p-2 bg-black/20 hover:bg-red-500/20 hover:text-red-400 rounded-full text-white/60 transition-all backdrop-blur-md border border-white/5 hover:border-red-500/30"
                    title="Eliminar Prospecto"
                  >
                    <Trash2 size={16} />
                  </button>
                  <button
                    onClick={() => setIsEditing(true)}
                    className="p-2 bg-black/20 hover:bg-indigo-500/20 hover:text-indigo-400 rounded-full text-white/60 transition-all backdrop-blur-md border border-white/5 hover:border-indigo-500/30"
                    title="Editar Información"
                  >
                    <Edit2 size={16} />
                  </button>
                </>
              )}
              <button
                onClick={onClose}
                className="p-2 bg-black/20 hover:bg-white/10 rounded-full text-white/60 hover:text-white transition-colors backdrop-blur-md border border-white/5"
              >
                <X size={16} />
              </button>
            </div>

            {/* Delete Confirmation Overlay (Unchanged logic, just keeping structure) */}
            {deleteConfirm && (
              <div className="absolute inset-0 z-30 bg-zinc-950/95 flex flex-col items-center justify-center p-6 text-center animate-in fade-in duration-200">
                <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mb-4 border border-red-500/20">
                  <AlertCircle className="text-red-500" size={32} />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">
                  ¿Estás seguro?
                </h3>
                <p className="text-zinc-400 mb-6 max-w-xs">
                  Esta acción moverá este prospecto a la papelera.
                </p>
                <div className="flex gap-3">
                  <button
                    onClick={() => setDeleteConfirm(false)}
                    className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-white rounded-lg font-medium transition-colors"
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={handleDelete}
                    disabled={isLoading}
                    className="px-4 py-2 bg-red-600 hover:bg-red-500 text-white rounded-lg font-medium transition-colors shadow-lg shadow-red-500/20 flex items-center gap-2"
                  >
                    {isLoading ? 'Eliminando...' : 'Sí, eliminar'}
                  </button>
                </div>
              </div>
            )}

            {/* Main Content */}
            <div className="relative z-10 px-8 pt-12 pb-8 overflow-y-auto custom-scrollbar flex flex-col h-full">
              {/* Header Section */}
              <div className="mb-8 mt-4">
                {' '}
                {/* Added mt-4 to push down from banner edge */}
                {isEditing ? (
                  <div className="space-y-4 animate-in fade-in slide-in-from-top-4 duration-300">
                    <input
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="w-full bg-black/30 border border-indigo-500/50 rounded-xl px-4 py-3 text-xl font-bold text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                      placeholder="Nombre del Prospecto"
                    />
                    <div className="grid grid-cols-2 gap-4">
                      <input
                        name="type"
                        value={formData.type}
                        onChange={handleInputChange}
                        className="w-full bg-black/30 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-indigo-500/50"
                        placeholder="Tipo"
                      />
                      <input
                        name="country"
                        value={formData.country}
                        onChange={handleInputChange}
                        className="w-full bg-black/30 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-indigo-500/50"
                        placeholder="País"
                      />
                      <input
                        name="niche"
                        value={formData.niche}
                        onChange={handleInputChange}
                        className="w-full bg-black/30 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-indigo-500/50"
                        placeholder="Rubro"
                      />
                      <input
                        name="url"
                        value={formData.url}
                        onChange={handleInputChange}
                        className="w-full bg-black/30 border border-white/10 rounded-lg px-3 py-2 text-sm text-zinc-400 focus:outline-none focus:border-indigo-500/50"
                        placeholder="Website URL"
                      />
                    </div>
                    <div className="flex gap-3 mt-4">
                      <button
                        onClick={handleSave}
                        disabled={isLoading}
                        className="flex-1 bg-indigo-600 hover:bg-indigo-500 text-white py-2.5 rounded-lg font-bold flex items-center justify-center gap-2 transition-all shadow-lg shadow-indigo-500/20"
                      >
                        <Save size={18} />{' '}
                        {isLoading ? 'Guardando...' : 'Guardar Cambios'}
                      </button>
                      <button
                        onClick={() => setIsEditing(false)}
                        className="px-4 bg-zinc-800 hover:bg-zinc-700 text-white py-2.5 rounded-lg font-medium transition-colors"
                      >
                        Cancelar
                      </button>
                    </div>
                  </div>
                ) : (
                  <div>
                    <h2 className="text-3xl font-bold text-white mb-4 leading-tight tracking-tight drop-shadow-lg">
                      {lead.name}
                    </h2>

                    <div className="flex flex-wrap items-center gap-3">
                      <span className="px-3 py-1.5 rounded-lg text-sm font-semibold bg-white/10 text-white backdrop-blur-md border border-white/10">
                        {lead.type}
                      </span>
                      <div className="h-6 w-px bg-white/10 mx-1"></div>
                      <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium text-zinc-300">
                        <MapPin size={16} className="text-zinc-500" />
                        {lead.country}
                      </div>
                      <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium text-zinc-300">
                        <Briefcase size={16} className="text-zinc-500" />
                        {lead.niche}
                      </div>
                    </div>

                    <div className="mt-8">
                      <a
                        href={lead.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-indigo-500 text-white px-8 py-3 rounded-xl font-bold text-sm tracking-wide hover:from-indigo-500 hover:to-indigo-400 transition-all shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 hover:-translate-y-0.5"
                      >
                        <ExternalLink size={18} />
                        Visitar Sitio Web
                      </a>
                    </div>
                  </div>
                )}
              </div>

              {/* Score Breakdown Section */}
              {lead.scoring && typeof lead.scoring.score === 'number' && (
                <div className="mb-8 border-t border-white/5 pt-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-widest flex items-center gap-2 mb-4">
                    <Target size={14} /> Análisis de Prioridad
                  </h3>

                  <div className="bg-zinc-800/40 p-6 rounded-2xl border border-white/5 relative overflow-hidden">
                    {/* Background Glow based on Bucket */}
                    <div
                      className={clsx(
                        'absolute top-0 right-0 w-64 h-64 blur-3xl rounded-full opacity-10 pointer-events-none -translate-y-1/2 translate-x-1/2',
                        getScoreTone(lead.scoring.score).glow
                      )}
                    ></div>

                    <div className="flex items-start justify-between mb-6 relative z-10">
                      <div>
                        <div className="text-4xl font-black text-white leading-none mb-1 flex items-baseline gap-2">
                          {lead.scoring.score}
                          <span className="text-sm font-medium text-zinc-400 font-sans tracking-normal">
                            / 100
                          </span>
                        </div>
                        <div
                          className={clsx(
                            'inline-flex px-2 py-0.5 rounded text-xs font-bold uppercase tracking-wide border',
                            getScoreTone(lead.scoring.score).badge
                          )}
                        >
                          {getScoreTone(lead.scoring.score).label}
                        </div>
                      </div>
                      {lead.enrichment?.final_recommendation && (
                        <div
                          className={clsx(
                            'inline-flex px-2 py-1 rounded-lg text-xs font-bold uppercase tracking-wide border',
                            getRecommendationTone(lead.enrichment.final_recommendation)
                          )}
                          title="Recomendación final"
                        >
                          {lead.enrichment.final_recommendation}
                        </div>
                      )}
                    </div>

                    {lead.enrichment?.analysis_summary && (
                      <p className="text-zinc-300 text-sm leading-relaxed relative z-10 mb-5">
                        {lead.enrichment.analysis_summary}
                      </p>
                    )}

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 relative z-10">
                      {[
                        {
                          key: 'engagement',
                          label: 'Engagement',
                          val: lead.enrichment?.scores?.engagement,
                        },
                        {
                          key: 'vertical_affinity',
                          label: 'Afinidad vertical',
                          val: lead.enrichment?.scores?.vertical_affinity,
                        },
                        {
                          key: 'elearning_interest',
                          label: 'Interés e-learning',
                          val: lead.enrichment?.scores?.elearning_interest,
                        },
                        {
                          key: 'innovation_signals',
                          label: 'Señales de innovación',
                          val: lead.enrichment?.scores?.innovation_signals,
                        },
                      ].map((it) => {
                        const v10 = Math.max(0, Math.min(10, Number(it.val) || 0))
                        const tone = getScoreTone(v10 * 10)
                        return (
                          <div
                            key={it.key}
                            className="bg-black/30 p-3 rounded-xl border border-white/5"
                          >
                            <div className="text-[10px] text-zinc-500 uppercase font-bold mb-1">
                              {it.label}
                            </div>
                            <div className="flex items-baseline gap-2">
                              <div className={clsx('text-white font-black text-2xl', tone.text)}>
                                {v10}
                              </div>
                              <div className="text-xs text-zinc-500 font-semibold">/ 10</div>
                            </div>
                          </div>
                        )
                      })}
                    </div>

                    {Array.isArray(lead.enrichment?.detected_verticals) &&
                      lead.enrichment.detected_verticals.length > 0 && (
                        <div className="mt-5 space-y-3 relative z-10">
                          <div>
                            <div className="text-xs uppercase tracking-widest text-zinc-500 font-bold mb-2">
                              Verticales detectadas
                            </div>
                            <div className="flex flex-wrap gap-2">
                              {lead.enrichment.detected_verticals.slice(0, 12).map((v, idx) => (
                                <span
                                  key={`${v}-${idx}`}
                                  className="px-2.5 py-1 bg-indigo-500/10 border border-indigo-500/20 rounded-md text-xs text-indigo-200"
                                >
                                  {v}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>
                      )}
                  </div>
                </div>
              )}

              {/* Details Grid - Better Spacing */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-6 border-t border-white/5 mt-auto">
                {/* Social Media - Minimalist List */}
                <div className="space-y-4">
                  <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-widest flex items-center gap-2 mb-4">
                    <Globe size={14} /> Redes
                  </h3>
                  {lead.social_media && lead.social_media.length > 0 ? (
                    <div className="flex flex-col gap-2">
                      {lead.social_media.map((social, idx) => {
                        const style = getSocialStyle(social.network)
                        return (
                          <a
                            key={idx}
                            href={social.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={`flex items-center justify-between p-3 rounded-xl border transition-all group ${style.bg} ${style.border} ${style.hover}`}
                          >
                            <div className="flex items-center gap-4">
                              <span
                                className={`${style.color} group-hover:scale-110 transition-transform`}
                              >
                                {style.icon}
                              </span>
                              <span className="font-bold text-sm text-white capitalizetracking-wide">
                                {social.network}
                              </span>
                            </div>
                            <div className="flex items-center gap-3">
                              {social.followers && (
                                <span className="text-xs font-mono text-zinc-300 bg-black/40 px-2.5 py-1 rounded-md border border-white/5 group-hover:border-white/10 transition-colors">
                                  {social.followers}
                                </span>
                              )}
                              <ExternalLink
                                size={14}
                                className={`opacity-0 group-hover:opacity-100 transition-all ${style.color}`}
                              />
                            </div>
                          </a>
                        )
                      })}
                    </div>
                  ) : (
                    <p className="text-zinc-600 text-sm italic pl-2">
                      No hay redes sociales registradas.
                    </p>
                  )}
                </div>

                {/* Signals - Clean Layout */}
                <div className="space-y-4">
                  <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-widest flex items-center gap-2 mb-4">
                    <Target size={14} /> Señales de Interés
                  </h3>
                  {lead.signals && lead.signals.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {lead.signals.map((signal, index) => (
                        <div
                          key={index}
                          className="px-3 py-2 bg-emerald-500/5 text-emerald-400/90 border border-emerald-500/10 rounded-lg text-sm font-medium leading-relaxed hover:bg-emerald-500/10 hover:border-emerald-500/20 transition-colors cursor-default"
                        >
                          {signal}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-zinc-600 text-sm italic pl-2">
                      No se detectaron señales específicas.
                    </p>
                  )}
                </div>
              </div>

              {/* Notes Section - Optional */}
              {lead.notes && (
                <div className="mt-8 pt-6 border-t border-white/5">
                  <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-3">
                    Notas Adicionales
                  </h3>
                  <p className="text-zinc-300 bg-zinc-800/30 p-4 rounded-xl text-sm leading-relaxed border border-white/5">
                    {lead.notes}
                  </p>
                </div>
              )}
            </div>
          </MotionDiv>
        </MotionDiv>
      )}
    </AnimatePresence>,
    document.body
  )
}

export default LeadDetailModal
