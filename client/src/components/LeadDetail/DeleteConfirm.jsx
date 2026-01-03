import { AlertCircle } from 'lucide-react'

const DeleteConfirm = ({ onCancel, onConfirm, isLoading }) => (
  <div className="absolute inset-0 z-30 bg-zinc-950/95 flex flex-col items-center justify-center p-6 text-center animate-in fade-in duration-200">
    <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mb-4 border border-red-500/20">
      <AlertCircle className="text-red-500" size={32} />
    </div>
    <h3 className="text-xl font-bold text-white mb-2">¿Estás seguro?</h3>
    <p className="text-zinc-400 mb-6 max-w-xs">
      Esta acción moverá este prospecto a la papelera.
    </p>
    <div className="flex gap-3">
      <button
        onClick={onCancel}
        className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-white rounded-lg font-medium transition-colors"
      >
        Cancelar
      </button>
      <button
        onClick={onConfirm}
        disabled={isLoading}
        className="px-4 py-2 bg-red-600 hover:bg-red-500 text-white rounded-lg font-medium transition-colors shadow-lg shadow-red-500/20 flex items-center gap-2"
      >
        {isLoading ? 'Eliminando...' : 'Sí, eliminar'}
      </button>
    </div>
  </div>
)

export default DeleteConfirm

