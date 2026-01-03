import { Trash2, Edit2, X } from 'lucide-react'

const HeaderActions = ({
  isEditing,
  deleteConfirm,
  onDeleteClick,
  onEditClick,
  onClose,
}) => (
  <div className="absolute top-4 right-4 z-20 flex gap-2">
    {!isEditing && !deleteConfirm && (
      <>
        <button
          onClick={onDeleteClick}
          className="p-2 bg-black/20 hover:bg-red-500/20 hover:text-red-400 rounded-full text-white/60 transition-all backdrop-blur-md border border-white/5 hover:border-red-500/30"
          title="Eliminar Prospecto"
        >
          <Trash2 size={16} />
        </button>
        <button
          onClick={onEditClick}
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
)

export default HeaderActions

