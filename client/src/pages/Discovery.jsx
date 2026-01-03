import { useEffect, useRef, useState } from 'react'
import { useDiscoverLeads, useSaveLeads } from '../hooks/useLeads'
import {
  Search,
  Loader2,
  AlertCircle,
  CheckCircle,
  Sparkles,
  Save,
  ArrowUpDown,
  Info,
  Trash2,
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import clsx from 'clsx'
import CountrySelector from '../components/CountrySelector'
import NicheSelector from '../components/NicheSelector'
import LeadDetailModal from '../components/LeadDetailModal'
import ConfirmModal from '../components/ConfirmModal'
import {
  clearDiscoveryState,
  getDiscoveryState,
  setDiscoveryState,
} from '../state/discoveryState'

const MotionForm = motion.form
const MotionDiv = motion.div

const hasAnySocialUrl = (lead) => {
  if (!lead?.social_media || !Array.isArray(lead.social_media)) return false
  return lead.social_media.some(
    (s) => typeof s?.url === 'string' && s.url.trim().length > 0
  )
}

const hasValidLeadUrl = (lead) =>
  typeof lead?.url === 'string' && lead.url.trim().length > 0

const Discovery = () => {
  const stored = getDiscoveryState()

  const [country, setCountry] = useState(stored?.country || '')
  const [niche, setNiche] = useState(stored?.niche || '')
  const [maxResults, setMaxResults] = useState(stored?.maxResults || '') // Empty by default to show placeholder
  const [successMsg, setSuccessMsg] = useState(null)
  const [leads, setLeads] = useState(
    Array.isArray(stored?.leads) ? stored.leads : []
  ) // Results from search
  const [selectedLeads, setSelectedLeads] = useState(
    new Set(Array.isArray(stored?.selectedLeads) ? stored.selectedLeads : [])
  ) // IDs (url) of selected leads

  // Mutations
  const {
    mutateAsync: discoverLeads,
    isPending: loading,
    error: discoverError,
    reset: resetDiscover
  } = useDiscoverLeads();

  const {
    mutateAsync: saveLeads,
    isPending: saving,
    error: saveError,
    reset: resetSave
  } = useSaveLeads();

  const error = discoverError?.message || saveError?.message;

  // Filtering & Sorting
  const [filterText, setFilterText] = useState(stored?.filterText || '')
  const [sortConfig, setSortConfig] = useState(
    stored?.sortConfig || { key: null, direction: 'asc' }
  )
  const [showOnlyWithSocial, setShowOnlyWithSocial] = useState(
    stored?.showOnlyWithSocial ?? true
  )
  const [viewLead, setViewLead] = useState(null) // Lead currently being viewed in modal

  // Confirm flows (styled modal)
  const [confirmType, setConfirmType] = useState(null) // 'clear' | 'overwrite' | null
  const [pendingOverwriteLeads, setPendingOverwriteLeads] = useState([])
  const [pendingOverwriteDuplicates, setPendingOverwriteDuplicates] = useState(
    []
  )

  // Persist ONLY in memory when leaving the route (unmount). This survives SPA navigation
  // but is cleared on full page refresh.
  const snapshotRef = useRef(null)
  snapshotRef.current = {
    country,
    niche,
    maxResults,
    leads,
    selectedLeads: Array.from(selectedLeads),
    filterText,
    sortConfig,
    showOnlyWithSocial,
  }

  useEffect(() => {
    return () => {
      setDiscoveryState(snapshotRef.current)
    }
  }, [])

  const handleSearch = async (e) => {
    e.preventDefault()

    // Validate required fields
    if (!country || country.trim() === '') {
      resetDiscover(); // Use reset to clear previous errors if any
      // We still need a way to show local validation errors if we don't want to use state.
      // But for simplicity in this migration, I'll keep the local error message logic where possible
      // or just use the mutation error.
      return
    }

    if (!niche || niche.trim() === '') {
      return
    }

    // Validate maxResults
    if (!maxResults || maxResults.trim() === '') {
      return
    }

    const maxResultsNum = parseInt(maxResults)
    if (isNaN(maxResultsNum) || maxResultsNum < 1 || maxResultsNum > 30) {
      return
    }

    setSuccessMsg(null)
    setLeads([])
    setSelectedLeads(new Set())

    try {
      const data = await discoverLeads({
        country,
        niche,
        maxResults: maxResultsNum,
      })

      if (data.success) {
        const incoming = Array.isArray(data.leads)
          ? data.leads
          : []
        // Always store raw results; filters (e.g. "Con redes") are applied in the UI layer.
        setLeads(incoming.filter(hasValidLeadUrl))
      }
    } catch {
      // Error handled by mutation
    }
  }

  const clearResults = () => {
    resetDiscover()
    resetSave()
    setSuccessMsg(null)
    setLeads([])
    setSelectedLeads(new Set())
    setFilterText('')
    setSortConfig({ key: null, direction: 'asc' })
    setShowOnlyWithSocial(true)

    clearDiscoveryState()
  }

  // If the user enables the filter after results are loaded, prune selection to avoid
  // having selected leads that no longer match the constraint.
  useEffect(() => {
    if (!showOnlyWithSocial) return
    setSelectedLeads((prev) => {
      const allowed = new Set(leads.filter(hasAnySocialUrl).map((l) => l.url))
      const next = new Set()
      for (const url of prev) {
        if (allowed.has(url)) next.add(url)
      }
      return next
    })
  }, [showOnlyWithSocial, leads])

  const handleClearResults = () => {
    setConfirmType('clear')
  }

  const handleSaveSelected = async () => {
    if (selectedLeads.size === 0) return
    setSuccessMsg(null)
    setConfirmType(null)
    setPendingOverwriteLeads([])
    setPendingOverwriteDuplicates([])

    const leadsToSave = leads.filter((l) => selectedLeads.has(l.url))

    try {
      const res = await saveLeads({
        leads: leadsToSave,
        country: country, // Pass context
        niche: niche, // Pass context
      })

      const stats = res?.stats || { new: 0, updated: 0 }
      const duplicates = Array.isArray(res?.duplicates)
        ? res.duplicates
        : []

      setSuccessMsg(
        `Guardado: ${stats.new} nuevos, ${stats.updated} actualizados.`
      )
      setSelectedLeads(new Set())

      if (duplicates.length > 0) {
        const dupUrls = new Set(duplicates.map((d) => d.url))
        const dupLeads = leadsToSave.filter((l) => dupUrls.has(l.url))
        setPendingOverwriteLeads(dupLeads)
        setPendingOverwriteDuplicates(duplicates)
        setConfirmType('overwrite')
      }
    } catch {
      // Error handled by mutation
    }
  }

  const confirmConfig = (() => {
    if (confirmType === 'clear') {
      return {
        title: '¿Limpiar resultados encontrados?',
        message:
          'Esta acción borrará la lista actual de prospectos encontrados y tus selecciones/filtros de la tabla.',
        details:
          'Aviso: estos prospectos fueron generados por IA y NO son determinísticos.\n' +
          'Si limpias la lista, es posible que la IA no vuelva a encontrar exactamente los mismos prospectos o que los encuentre con datos diferentes.',
        confirmText: 'Sí, limpiar',
        cancelText: 'Cancelar',
        tone: 'warning',
        onConfirm: () => {
          clearResults()
          setConfirmType(null)
        },
        onCancel: () => setConfirmType(null),
      }
    }

    if (confirmType === 'overwrite') {
      const count = pendingOverwriteLeads.length
      const incomingByUrl = new Map(
        pendingOverwriteLeads.map((l) => [l.url, l])
      )
      const items = (
        Array.isArray(pendingOverwriteDuplicates)
          ? pendingOverwriteDuplicates
          : []
      )
        .slice(0, 50)
        .map((d) => {
          const incoming = incomingByUrl.get(d.url)
          const incomingName = incoming?.name || d.incoming?.name || d.url
          const existingName = d.existing?.name || 'Sin nombre'
          return {
            title: incomingName,
            subtitle: d.url,
            meta: `Existente: ${existingName}`,
          }
        })
      return {
        title: `Detectamos ${count} duplicado(s) por URL`,
        message:
          'Ya tenés prospectos guardados con la misma URL. Podés dejarlos como están o sobreescribirlos con los datos recién encontrados.',
        details:
          'Si decides SOBREESCRIBIR, se reemplazará la información actual del prospecto.\n' +
          'Advertencia: cualquier campaña o automatización que esté ejecutándose sobre ese prospecto debería detenerse/reiniciarse para evitar inconsistencias.',
        items,
        confirmText: 'Sobreescribir',
        cancelText: 'No, mantener actuales',
        tone: 'danger',
        isLoading: saving,
        onConfirm: async () => {
          if (pendingOverwriteLeads.length === 0) {
            setConfirmType(null)
            return
          }
          setSuccessMsg(null)
          try {
            const res2 = await saveLeads({
              leads: pendingOverwriteLeads,
              country,
              niche,
              overwrite: true,
            })
            const stats2 = res2?.stats || { new: 0, updated: 0 }
            setSuccessMsg(`Sobreescritos: ${stats2.updated}.`)
    } catch {
            // Error handled by mutation
          } finally {
            setPendingOverwriteLeads([])
            setPendingOverwriteDuplicates([])
            setConfirmType(null)
          }
        },
        onCancel: () => {
          setSuccessMsg((prev) => {
            const base = prev ? `${prev} ` : ''
            return `${base}${pendingOverwriteLeads.length} duplicado(s) por URL quedaron sin cambios.`
          })
          setPendingOverwriteLeads([])
          setPendingOverwriteDuplicates([])
          setConfirmType(null)
        },
      }
    }

    return null
  })()

  const toggleSelectAll = () => {
    if (selectedLeads.size === displayedLeads.length) {
      setSelectedLeads(new Set())
    } else {
      setSelectedLeads(new Set(displayedLeads.map((l) => l.url)))
    }
  }

  const toggleSelectOne = (url) => {
    const newSelected = new Set(selectedLeads)
    if (newSelected.has(url)) {
      newSelected.delete(url)
    } else {
      newSelected.add(url)
    }
    setSelectedLeads(newSelected)
  }

  const handleSort = (key) => {
    let direction = 'asc'
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc'
    }
    setSortConfig({ key, direction })
  }

  const getSortedAndFilteredLeads = () => {
    let processed = [...leads]

    // Filter by text
    if (filterText) {
      processed = processed.filter((l) =>
        l.name.toLowerCase().includes(filterText.toLowerCase())
      )
    }

    // Filter by social media
    if (showOnlyWithSocial) {
      processed = processed.filter(hasAnySocialUrl)
    }

    // Sort
    if (sortConfig.key) {
      processed.sort((a, b) => {
        let aVal, bVal

        switch (sortConfig.key) {
          case 'name':
            aVal = (a.name || '').toLowerCase()
            bVal = (b.name || '').toLowerCase()
            break
          case 'type':
            aVal = (a.type || '').toLowerCase()
            bVal = (b.type || '').toLowerCase()
            break
          case 'social':
            aVal = (a.social_media && a.social_media.length) || 0
            bVal = (b.social_media && b.social_media.length) || 0
            break
          default:
            aVal = a[sortConfig.key] || ''
            bVal = b[sortConfig.key] || ''
        }

        if (aVal < bVal) return sortConfig.direction === 'asc' ? -1 : 1
        if (aVal > bVal) return sortConfig.direction === 'asc' ? 1 : -1
        return 0
      })
    }
    return processed
  }

  const displayedLeads = getSortedAndFilteredLeads()

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {confirmConfig && (
        <ConfirmModal
          isOpen={!!confirmConfig}
          title={confirmConfig.title}
          message={confirmConfig.message}
          details={confirmConfig.details}
          items={confirmConfig.items}
          confirmText={confirmConfig.confirmText}
          cancelText={confirmConfig.cancelText}
          tone={confirmConfig.tone}
          isLoading={confirmConfig.isLoading}
          onConfirm={confirmConfig.onConfirm}
          onCancel={confirmConfig.onCancel}
        />
      )}
      {/* Header con elementos decorativos sutiles */}
      <div className="relative">
        {/* Blobs decorativos sutiles */}
        <div className="absolute -top-32 -left-32 w-80 h-80 bg-indigo-500/20 rounded-full blur-[120px] pointer-events-none"></div>
        <div className="absolute -top-32 -right-32 w-80 h-80 bg-purple-500/15 rounded-full blur-[120px] pointer-events-none"></div>

        <div className="relative z-10 space-y-4">
          <div className="flex items-center gap-3">
            <h2 className="text-4xl font-bold text-white tracking-tight">
              Descubrimiento de Prospectos
            </h2>
            <Sparkles className="text-indigo-400" size={28} />
          </div>

          {/* Bloque informativo destacado */}
          <div className="bg-indigo-500/10 border border-indigo-500/20 rounded-lg p-4 backdrop-blur-sm">
            <div className="flex gap-3">
              <div className="shrink-0">
                <Info className="text-indigo-400" size={20} />
              </div>
              <div>
                <p className="text-zinc-200 text-sm leading-relaxed mb-1.5">
                  Utiliza inteligencia artificial para encontrar socios
                  estratégicos potenciales en tiempo real.
                </p>
                <p className="text-zinc-400 text-xs leading-relaxed">
                  Define tu mercado objetivo y el rubro de interés, y obtén una
                  lista curada de prospectos relevantes con información clave
                  para tu análisis.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Formulario con gradiente sutil */}
      <MotionForm
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        onSubmit={handleSearch}
        className="relative z-20 bg-zinc-900/60 backdrop-blur-md border border-white/10 p-6 rounded-xl"
      >
        {/* Gradiente de fondo sutil */}
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-purple-500/5 pointer-events-none"></div>

        <div className="relative z-20 space-y-6">
          {/* Inputs principales en una fila */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-zinc-200">
                País Objetivo
              </label>
              <CountrySelector value={country} onChange={setCountry} />
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium text-zinc-200">
                Rubro o Industria
              </label>
              <NicheSelector value={niche} onChange={setNiche} />
            </div>
          </div>

          {/* Cantidad, filtro y botón */}
          <div className="flex flex-col md:flex-row gap-4 md:items-end">
            <div className="w-full md:w-auto bg-black/40 border border-white/10 rounded-xl px-4 py-3 hover:bg-black/60 transition-colors select-none">
              <div className="flex items-center justify-between gap-4">
                <div className="min-w-0 flex items-center gap-2">
                  <div className="text-sm font-semibold text-zinc-200 leading-tight whitespace-nowrap">
                    Cantidad
                  </div>
                  <span
                    className="inline-flex items-center justify-center w-5 h-5 rounded-full border border-white/10 bg-white/5 text-zinc-300 text-[11px] leading-none"
                    title="Cantidad máxima de prospectos a buscar, la IA puede no encontrar el número exacto ingresado."
                    aria-label="Ayuda: cantidad de prospectos"
                  >
                    i
                  </span>
                </div>

                <div className="shrink-0">
                  <input
                    type="number"
                    min="1"
                    max="30"
                    value={maxResults}
                    onChange={(e) => setMaxResults(e.target.value)}
                    placeholder="1–30"
                    inputMode="numeric"
                    className="w-20 h-6 bg-black/30 border border-white/10 rounded-lg px-3 text-sm text-white text-center leading-6 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 transition-all placeholder:text-zinc-600"
                    aria-label="Cantidad de prospectos"
                  />
                </div>
              </div>
            </div>

            <label className="w-full md:w-auto bg-black/40 border border-white/10 rounded-xl px-4 py-3 hover:bg-black/60 transition-colors cursor-pointer select-none">
              <div className="flex items-center justify-between gap-4">
                <div className="min-w-0 flex items-center gap-2">
                  <div className="text-sm font-semibold text-zinc-200 leading-tight whitespace-nowrap">
                    Con redes
                  </div>
                  <span
                    className="inline-flex items-center justify-center w-5 h-5 rounded-full border border-white/10 bg-white/5 text-zinc-300 text-[11px] leading-none"
                    title="Excluye prospectos que no tengan al menos una URL válida en sus redes sociales."
                    aria-label="Ayuda: filtro por redes sociales"
                  >
                    i
                  </span>
                </div>

                <div className="shrink-0">
                  <input
                    type="checkbox"
                    checked={showOnlyWithSocial}
                    onChange={(e) => setShowOnlyWithSocial(e.target.checked)}
                    className="sr-only peer"
                    aria-label="Filtrar solo prospectos con redes sociales"
                  />
                  <div className="relative w-11 h-6 rounded-full bg-zinc-700/80 border border-white/10 peer-checked:bg-indigo-600/90 peer-checked:border-indigo-500/40 transition-colors after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:w-5 after:h-5 after:rounded-full after:bg-white/90 after:shadow-md after:shadow-black/30 after:transition-transform peer-checked:after:translate-x-5" />
                </div>
              </div>
            </label>

            <div className="w-full md:flex-1 flex md:justify-end">
              <button
                type="submit"
                disabled={loading}
                className="w-full md:w-auto md:self-end inline-flex items-center justify-center gap-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white px-8 py-3 rounded-lg font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-indigo-500/20"
              >
                {loading ? (
                  <>
                    <Loader2 className="animate-spin" size={18} />
                    Buscando...
                  </>
                ) : (
                  <>
                    <Search size={18} />
                    Buscar Prospectos
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </MotionForm>

      <AnimatePresence>
        {error && (
          <MotionDiv
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-xl flex items-center gap-3 backdrop-blur-sm"
          >
            <AlertCircle size={20} />
            {error}
          </MotionDiv>
        )}
        {successMsg && (
          <MotionDiv
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 p-4 rounded-xl flex items-center gap-3 backdrop-blur-sm"
          >
            <CheckCircle size={20} />
            {successMsg}
          </MotionDiv>
        )}
      </AnimatePresence>

      {leads.length > 0 && (
        <MotionDiv
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6 relative z-10"
        >
          {/* Controls Row */}
          <div className="flex flex-col md:flex-row gap-3 justify-between items-center bg-zinc-900/50 p-4 rounded-lg border border-white/10">
            <div className="flex flex-col md:flex-row gap-3 w-full md:w-auto">
              <div className="relative w-full md:w-64">
                <Search
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500"
                  size={16}
                />
                <input
                  type="text"
                  placeholder="Filtrar por nombre..."
                  value={filterText}
                  onChange={(e) => setFilterText(e.target.value)}
                  className="w-full bg-black/40 border border-white/10 rounded-lg pl-9 pr-4 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                />
              </div>
            </div>
            <div className="flex items-center gap-3 w-full md:w-auto">
              <span className="text-zinc-400 text-sm">
                {displayedLeads.length} de {leads.length} • {selectedLeads.size}{' '}
                seleccionados
              </span>
              <button
                onClick={handleClearResults}
                type="button"
                className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 px-5 py-2 rounded-lg font-medium transition-colors border border-white/10"
                title="Limpiar resultados"
              >
                <Trash2 size={16} />
                Limpiar
              </button>
              <button
                onClick={handleSaveSelected}
                disabled={saving || selectedLeads.size === 0}
                className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white px-5 py-2 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {saving ? (
                  <Loader2 className="animate-spin" size={16} />
                ) : (
                  <Save size={16} />
                )}
                Guardar Seleccionados
              </button>
            </div>
          </div>

          <div className="bg-zinc-900/50 border border-white/10 rounded-lg overflow-hidden overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-gradient-to-r from-zinc-800/80 to-zinc-800/50 border-b border-white/10">
                <tr>
                  <th className="px-4 py-4 w-12">
                    <input
                      type="checkbox"
                      checked={
                        selectedLeads.size === displayedLeads.length &&
                        displayedLeads.length > 0
                      }
                      onChange={toggleSelectAll}
                      className="rounded border-zinc-700 bg-zinc-800 text-indigo-600 focus:ring-indigo-500"
                    />
                  </th>
                  <th
                    className="px-6 py-4 cursor-pointer hover:text-white transition-colors group"
                    onClick={() => handleSort('name')}
                  >
                    <div className="flex items-center gap-2 font-semibold text-white text-sm">
                      🏢 Organización
                      <ArrowUpDown
                        size={14}
                        className={clsx(
                          'transition-opacity',
                          sortConfig.key === 'name'
                            ? 'opacity-100'
                            : 'opacity-0 group-hover:opacity-50'
                        )}
                      />
                    </div>
                  </th>
                  <th
                    className="px-6 py-4 cursor-pointer hover:text-white transition-colors group"
                    onClick={() => handleSort('type')}
                  >
                    <div className="flex items-center gap-2 font-semibold text-white text-sm">
                      📋 Tipo
                      <ArrowUpDown
                        size={14}
                        className={clsx(
                          'transition-opacity',
                          sortConfig.key === 'type'
                            ? 'opacity-100'
                            : 'opacity-0 group-hover:opacity-50'
                        )}
                      />
                    </div>
                  </th>
                  <th
                    className="px-6 py-4 cursor-pointer hover:text-white transition-colors group min-w-[180px]"
                    onClick={() => handleSort('social')}
                  >
                    <div className="flex items-center gap-2 font-semibold text-white text-sm whitespace-nowrap">
                      👥 Redes Sociales
                      <ArrowUpDown
                        size={14}
                        className={clsx(
                          'transition-opacity',
                          sortConfig.key === 'social'
                            ? 'opacity-100'
                            : 'opacity-0 group-hover:opacity-50'
                        )}
                      />
                    </div>
                  </th>
                  <th className="px-6 py-4 max-w-[200px]">
                    <div className="font-semibold text-white text-sm">
                      💡 Señales
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {displayedLeads.map((lead) => (
                  <tr
                    key={lead.url}
                    className={clsx(
                      'transition-colors',
                      selectedLeads.has(lead.url)
                        ? 'bg-indigo-500/10 hover:bg-indigo-500/15'
                        : 'hover:bg-white/5'
                    )}
                  >
                    <td className="px-4 py-4">
                      <input
                        type="checkbox"
                        checked={selectedLeads.has(lead.url)}
                        onChange={() => toggleSelectOne(lead.url)}
                        onClick={(e) => e.stopPropagation()}
                        className="rounded border-zinc-700 bg-zinc-800 text-indigo-600 focus:ring-indigo-500 cursor-pointer relative z-20"
                      />
                    </td>
                    {/* Clickable Cells */}
                    <td
                      className="px-6 py-4 cursor-pointer"
                      onClick={() => setViewLead(lead)}
                    >
                      <div className="font-semibold text-white">
                        {lead.name}
                      </div>
                      <a
                        href={lead.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-indigo-400 hover:text-indigo-300 hover:underline text-xs truncate max-w-[250px] block mt-1 transition-colors relative z-20"
                        onClick={(e) => e.stopPropagation()}
                      >
                        {lead.url}
                      </a>
                      <div className="text-xs text-zinc-600 mt-1">{niche}</div>
                    </td>
                    <td
                      className="px-6 py-4 text-zinc-300 cursor-pointer"
                      onClick={() => setViewLead(lead)}
                    >
                      {lead.type}
                    </td>
                    <td
                      className="px-6 py-4 cursor-pointer"
                      onClick={() => setViewLead(lead)}
                    >
                      {lead.social_media && lead.social_media.length > 0 ? (
                        <div className="space-y-1.5">
                          {lead.social_media.map((social, idx) => (
                            <div key={idx} className="flex items-center gap-2">
                              <a
                                href={social.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-indigo-400 hover:text-indigo-300 font-medium text-xs hover:underline transition-colors relative z-20"
                                onClick={(e) => e.stopPropagation()}
                              >
                                {social.network}
                              </a>
                              <span className="text-zinc-500 text-xs">:</span>
                              <span className="text-zinc-400 text-xs font-mono">
                                {social.followers}
                              </span>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <span className="text-zinc-600 text-xs italic">
                          No disponible
                        </span>
                      )}
                    </td>
                    <td
                      className="px-6 py-4 cursor-pointer"
                      onClick={() => setViewLead(lead)}
                    >
                      <div className="flex flex-wrap gap-1.5">
                        {Array.isArray(lead.signals) &&
                          lead.signals.slice(0, 2).map((signal, i) => (
                            <span
                              key={i}
                              className="px-2.5 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-md text-xs text-emerald-300"
                            >
                              {signal}
                            </span>
                          ))}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {displayedLeads.length === 0 && (
              <div className="p-12 text-center text-zinc-500">
                {showOnlyWithSocial
                  ? 'No se encontraron prospectos con redes sociales (URL válida). Prueba desactivando "Con redes".'
                  : 'No se encontraron resultados con ese filtro.'}
              </div>
            )}
          </div>
        </MotionDiv>
      )}

      {/* Lead Detail Modal */}
      <LeadDetailModal
        isOpen={!!viewLead}
        onClose={() => setViewLead(null)}
        lead={viewLead}
      />
    </div>
  )
}

export default Discovery
