const NotesSection = ({ notes }) => {
  if (!notes) return null

  return (
    <div className="mt-8 pt-6 border-t border-white/5">
      <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-3">
        Notas Adicionales
      </h3>
      <p className="text-zinc-300 bg-zinc-800/30 p-4 rounded-xl text-sm leading-relaxed border border-white/5">
        {notes}
      </p>
    </div>
  )
}

export default NotesSection

