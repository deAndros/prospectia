import { Save } from 'lucide-react'

const LeadEditForm = ({ formData, onChange, onSave, onCancel, isLoading }) => (
  <div className="space-y-4 animate-in fade-in slide-in-from-top-4 duration-300">
    <input
      name="name"
      value={formData.name}
      onChange={onChange}
      className="w-full bg-black/30 border border-indigo-500/50 rounded-xl px-4 py-3 text-xl font-bold text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
      placeholder="Nombre del Prospecto"
    />
    <div className="grid grid-cols-2 gap-4">
      <input
        name="type"
        value={formData.type}
        onChange={onChange}
        className="w-full bg-black/30 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-indigo-500/50"
        placeholder="Tipo"
      />
      <input
        name="country"
        value={formData.country}
        onChange={onChange}
        className="w-full bg-black/30 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-indigo-500/50"
        placeholder="País"
      />
      <input
        name="niche"
        value={formData.niche}
        onChange={onChange}
        className="w-full bg-black/30 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-indigo-500/50"
        placeholder="Rubro"
      />
      <input
        name="url"
        value={formData.url}
        onChange={onChange}
        className="w-full bg-black/30 border border-white/10 rounded-lg px-3 py-2 text-sm text-zinc-400 focus:outline-none focus:border-indigo-500/50"
        placeholder="Website URL"
      />
    </div>
    <div className="flex gap-3 mt-4">
      <button
        onClick={onSave}
        disabled={isLoading}
        className="flex-1 bg-indigo-600 hover:bg-indigo-500 text-white py-2.5 rounded-lg font-bold flex items-center justify-center gap-2 transition-all shadow-lg shadow-indigo-500/20"
      >
        <Save size={18} /> {isLoading ? 'Guardando...' : 'Guardar Cambios'}
      </button>
      <button
        onClick={onCancel}
        className="px-4 bg-zinc-800 hover:bg-zinc-700 text-white py-2.5 rounded-lg font-medium transition-colors"
      >
        Cancelar
      </button>
    </div>
  </div>
)

export default LeadEditForm

