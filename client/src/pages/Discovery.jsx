import { useEffect, useRef, useState, useMemo } from 'react'
import { useDiscoverLeads, useSaveLeads } from '../hooks/leadHooks'
import { CheckCircle, AlertCircle } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import LeadDetailModal from '../components/LeadDetailModal'
import ConfirmModal from '../components/ConfirmModal'
import {
  clearDiscoveryState,
  getDiscoveryState,
  setDiscoveryState,
} from '../state/discoveryState'

// Componentes modulares
import DiscoveryHeader from '../components/Discovery/DiscoveryHeader'
import DiscoveryForm from '../components/Discovery/DiscoveryForm'
import DiscoveryControls from '../components/Discovery/DiscoveryControls'
import DiscoveryResultsTable from '../components/Discovery/DiscoveryResultsTable'

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
  const [maxResults, setMaxResults] = useState(stored?.maxResults || '')
  const [successMsg, setSuccessMsg] = useState(null)
  const [leads, setLeads] = useState(
    Array.isArray(stored?.leads) ? stored.leads : []
  )
  const [selectedLeads, setSelectedLeads] = useState(
    new Set(Array.isArray(stored?.selectedLeads) ? stored.selectedLeads : [])
  )

  // Mutaciones
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

  // Filtrado y ordenamiento
  const [filterText, setFilterText] = useState(stored?.filterText || '')
  const [sortConfig, setSortConfig] = useState(
    stored?.sortConfig || { key: null, direction: 'asc' }
  )
  const [showOnlyWithSocial, setShowOnlyWithSocial] = useState(
    stored?.showOnlyWithSocial ?? true
  )
  const [viewLead, setViewLead] = useState(null)

  // Flujos de confirmación
  const [confirmType, setConfirmType] = useState(null)
  const [pendingOverwriteLeads, setPendingOverwriteLeads] = useState([])
  const [pendingOverwriteDuplicates, setPendingOverwriteDuplicates] = useState(
    []
  )

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
    if (!country || !niche || !maxResults) return

    const maxResultsNum = parseInt(maxResults)
    if (isNaN(maxResultsNum) || maxResultsNum < 1 || maxResultsNum > 30) return

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
        const incoming = Array.isArray(data.leads) ? data.leads : []
        setLeads(incoming.filter(hasValidLeadUrl))
      }
    } catch { /* Handled by mutation */ }
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

  const handleSaveSelected = async () => {
    if (selectedLeads.size === 0) return
    setSuccessMsg(null)
    setConfirmType(null)
    const leadsToSave = leads.filter((l) => selectedLeads.has(l.url))

    try {
      const res = await saveLeads({ leads: leadsToSave, country, niche })
      const stats = res?.stats || { new: 0, updated: 0 }
      const duplicates = res?.duplicates || []

      setSuccessMsg(`Guardado: ${stats.new} nuevos, ${stats.updated} actualizados.`)
      setSelectedLeads(new Set())

      if (duplicates.length > 0) {
        const dupUrls = new Set(duplicates.map((d) => d.url))
        setPendingOverwriteLeads(leadsToSave.filter((l) => dupUrls.has(l.url)))
        setPendingOverwriteDuplicates(duplicates)
        setConfirmType('overwrite')
      }
    } catch { /* Handled by mutation */ }
  }

  const displayedLeads = useMemo(() => {
    let processed = [...leads]
    if (filterText) {
      processed = processed.filter((l) => l.name.toLowerCase().includes(filterText.toLowerCase()))
    }
    if (showOnlyWithSocial) {
      processed = processed.filter(hasAnySocialUrl)
    }
    if (sortConfig.key) {
      processed.sort((a, b) => {
        let aVal, bVal
        switch (sortConfig.key) {
          case 'name': aVal = (a.name || '').toLowerCase(); bVal = (b.name || '').toLowerCase(); break
          case 'type': aVal = (a.type || '').toLowerCase(); bVal = (b.type || '').toLowerCase(); break
          case 'social': aVal = a.social_media?.length || 0; bVal = b.social_media?.length || 0; break
          default: aVal = a[sortConfig.key] || ''; bVal = b[sortConfig.key] || ''
        }
        if (aVal < bVal) return sortConfig.direction === 'asc' ? -1 : 1
        if (aVal > bVal) return sortConfig.direction === 'asc' ? 1 : -1
        return 0
      })
    }
    return processed
  }, [leads, filterText, showOnlyWithSocial, sortConfig])

  const handleSort = (key) => {
    setSortConfig(current => ({
      key,
      direction: current.key === key && current.direction === 'asc' ? 'desc' : 'asc'
    }))
  }

  const confirmConfig = (() => {
    if (confirmType === 'clear') {
      return {
        title: '¿Limpiar resultados encontrados?',
        message: 'Esta acción borrará la lista actual de prospectos encontrados y tus selecciones/filtros de la tabla.',
        details: 'Aviso: estos prospectos fueron generados por IA y NO son determinísticos.',
        confirmText: 'Sí, limpiar',
        cancelText: 'Cancelar',
        tone: 'warning',
        onConfirm: () => { clearResults(); setConfirmType(null) },
        onCancel: () => setConfirmType(null),
      }
    }
    if (confirmType === 'overwrite') {
      return {
        title: `Detectamos ${pendingOverwriteLeads.length} duplicado(s)`,
        message: 'Ya tenés prospectos guardados con la misma URL.',
        items: pendingOverwriteDuplicates.slice(0, 50).map(d => ({
          title: d.incoming?.name || d.url,
          subtitle: d.url,
          meta: `Existente: ${d.existing?.name || 'Sin nombre'}`,
        })),
        confirmText: 'Sobreescribir',
        cancelText: 'Mantener actuales',
        tone: 'danger',
        isLoading: saving,
        onConfirm: async () => {
          try {
            const res2 = await saveLeads({ leads: pendingOverwriteLeads, country, niche, overwrite: true })
            setSuccessMsg(`Sobreescritos: ${res2.stats.updated}.`)
          } catch { /* Handled */ } finally { setConfirmType(null) }
        },
        onCancel: () => setConfirmType(null),
      }
    }
    return null
  })()

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {confirmConfig && <ConfirmModal isOpen={!!confirmConfig} {...confirmConfig} />}

      <DiscoveryHeader />

      <DiscoveryForm
        country={country} setCountry={setCountry}
        niche={niche} setNiche={setNiche}
        maxResults={maxResults} setMaxResults={setMaxResults}
        showOnlyWithSocial={showOnlyWithSocial} setShowOnlyWithSocial={setShowOnlyWithSocial}
        onSearch={handleSearch}
        loading={loading}
      />

      <AnimatePresence>
        {error && (
          <MotionDiv initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-xl flex items-center gap-3 backdrop-blur-sm">
            <AlertCircle size={20} /> {error}
          </MotionDiv>
        )}
        {successMsg && (
          <MotionDiv initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 p-4 rounded-xl flex items-center gap-3 backdrop-blur-sm">
            <CheckCircle size={20} /> {successMsg}
          </MotionDiv>
        )}
      </AnimatePresence>

      {leads.length > 0 && (
        <MotionDiv initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6 relative z-10">
          <DiscoveryControls
            filterText={filterText} setFilterText={setFilterText}
            displayedCount={displayedLeads.length} totalCount={leads.length}
            selectedCount={selectedLeads.size}
            onClear={() => setConfirmType('clear')}
            onSave={handleSaveSelected}
            saving={saving}
          />

          <DiscoveryResultsTable
            leads={displayedLeads}
            selectedLeads={selectedLeads}
            onToggleSelectAll={() => setSelectedLeads(selectedLeads.size === displayedLeads.length ? new Set() : new Set(displayedLeads.map(l => l.url)))}
            onToggleOne={(url) => setSelectedLeads(prev => {
              const next = new Set(prev);
              if (next.has(url)) next.delete(url); else next.add(url);
              return next;
            })}
            onSelectLead={setViewLead}
            sortConfig={sortConfig}
            onSort={handleSort}
            niche={niche}
          />
        </MotionDiv>
      )}

      <LeadDetailModal isOpen={!!viewLead} onClose={() => setViewLead(null)} lead={viewLead} />
    </div>
  )
}

export default Discovery;
