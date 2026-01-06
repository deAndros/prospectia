import { useMemo, useState } from 'react'
import { Users } from 'lucide-react'
import {
    useLists,
    useLeadFilters,
    useLeadsForLists,
    useCreateList,
    useUpdateList,
    useDeleteList,
} from '../hooks/listHooks'
import { useDeleteLead } from '../hooks/leadHooks'

// Componentes principales
import ConfirmModal from '../components/ConfirmModal'
import LeadDetailModal from '../components/LeadDetailModal'

// Componentes modulares específicos de listas
import ListsSidebar from '../components/Lists/ListsSidebar'
import ProspectTable from '../components/Lists/ProspectTable'
import Wizard from '../components/Lists/Wizard'
import AddProspectModal from '../components/Lists/AddProspectModal'

const Leads = () => {
    // Consultas
    const { data: lists = [] } = useLists()
    const { data } = useLeadFilters()
    const options = data?.filters || { countries: [], niches: [] }
    const { data: leads = [] } = useLeadsForLists()

    // Mutaciones
    const createMutation = useCreateList()
    const updateMutation = useUpdateList()
    const deleteMutation = useDeleteList()
    const leadDeleteMutation = useDeleteLead()

    // Estado de UI
    const [selectedListId, setSelectedListId] = useState(null)
    const [listSearch, setListSearch] = useState('')
    const [sortBy, setSortBy] = useState('newest') // newest | alpha
    const [showWizard, setShowWizard] = useState(false)
    const [showAddModal, setShowAddModal] = useState(false)
    const [confirmDelete, setConfirmDelete] = useState(null)
    const [prospectToDelete, setProspectToDelete] = useState(null)
    const [confirmRemove, setConfirmRemove] = useState(null)
    const [selectedLead, setSelectedLead] = useState(null)

    // Datos memorizados
    const selectedList = useMemo(() => lists.find(l => l._id === selectedListId), [lists, selectedListId])

    const filteredLists = useMemo(() => {
        let result = lists.filter(l => l.name.toLowerCase().includes(listSearch.toLowerCase()))
        if (sortBy === 'alpha') result.sort((a, b) => a.name.localeCompare(b.name))
        else result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        return result
    }, [lists, listSearch, sortBy])

    const tableLeads = useMemo(() => {
        if (!selectedList) return leads
        const prospectIds = new Set(selectedList.prospects || [])
        return leads.filter(l => prospectIds.has(l._id))
    }, [leads, selectedList])

    // Manejadores
    const handleCreateList = async (data) => {
        try {
            await createMutation.mutateAsync(data)
        } catch (err) {
            alert('Error: ' + err.message)
        }
    }

    const handleRemoveFromList = async (prospectId) => {
        if (!selectedList) return
        const nextProspects = (selectedList.prospects || []).filter(id => id !== prospectId)
        try {
            await updateMutation.mutateAsync({ id: selectedList._id, data: { prospects: nextProspects } })
        } catch (err) {
            alert('Error: ' + err.message)
        }
    }

    const handleAddToList = async (prospectIds) => {
        if (!selectedList) return
        const nextProspects = [...new Set([...(selectedList.prospects || []), ...prospectIds])]
        try {
            await updateMutation.mutateAsync({ id: selectedList._id, data: { prospects: nextProspects } })
        } catch (err) {
            alert('Error: ' + err.message)
        }
    }

    const handleDeleteLead = async () => {
        if (!prospectToDelete) return
        try {
            await leadDeleteMutation.mutateAsync(prospectToDelete._id)
            setProspectToDelete(null)
        } catch (err) {
            alert('Error: ' + err.message)
        }
    }

    const leadMemberships = useMemo(() => {
        if (!prospectToDelete) return []
        return lists.filter(l => (l.prospects || []).includes(prospectToDelete._id))
    }, [prospectToDelete, lists])

    return (
        <div className="max-w-[1600px] mx-auto h-[calc(100vh-8rem)] flex flex-col">
            <div className="flex flex-1 gap-12 min-h-0">
                <ListsSidebar
                    lists={lists}
                    selectedListId={selectedListId}
                    listSearch={listSearch}
                    setListSearch={setListSearch}
                    sortBy={sortBy}
                    setSortBy={setSortBy}
                    onAddList={() => setShowWizard(true)}
                    onSelectList={setSelectedListId}
                    onDeleteList={setConfirmDelete}
                    filteredLists={filteredLists}
                />

                {/* Contenido central */}
                <div className="flex-1 flex flex-col min-w-0 pt-4 px-2">
                    <div className="mb-8 flex items-end justify-between">
                        <div className="flex items-center gap-3 bg-white/5 border border-white/10 px-6 py-3 rounded-3xl backdrop-blur-xl">
                            <span className="text-lg font-black text-white uppercase tracking-tighter">
                                {selectedList ? selectedList.name : 'Mis Prospectos'}
                            </span>
                            <div className="flex items-center gap-1.5 ml-4 pl-4 border-l border-white/10">
                                <Users size={16} className="text-indigo-400" />
                                <span className="text-sm font-black text-indigo-300 bg-indigo-500/10 px-3 py-1 rounded-xl shadow-inner">{tableLeads.length}</span>
                            </div>
                        </div>

                    </div>

                    <ProspectTable
                        leads={tableLeads}
                        selectedList={selectedList}
                        lists={lists}
                        onRemove={setConfirmRemove}
                        onDelete={setProspectToDelete}
                        onAddClick={() => setShowAddModal(true)}
                        onSelectLead={setSelectedLead}
                    />
                </div>
            </div>

            <Wizard
                isOpen={showWizard}
                onClose={() => setShowWizard(false)}
                options={options}
                leads={leads}
                onCreate={handleCreateList}
            />

            <AddProspectModal
                isOpen={showAddModal}
                onClose={() => setShowAddModal(false)}
                leads={leads}
                currentProspects={selectedList?.prospects || []}
                onAdd={handleAddToList}
            />

            {confirmRemove && (
                <ConfirmModal
                    isOpen={!!confirmRemove}
                    title="Quitar de la Lista"
                    message={`¿Deseas quitar a "${confirmRemove.name}" de la lista "${selectedList?.name}"?`}
                    details="El prospecto no será eliminado del sistema, solo se quitará de esta lista específica."
                    confirmText="Quitar de la lista"
                    onConfirm={async () => {
                        if (!confirmRemove) return
                        try {
                            await handleRemoveFromList(confirmRemove._id)
                            setConfirmRemove(null)
                        } catch (err) {
                            alert('Error: ' + err.message)
                        }
                    }}
                    onCancel={() => setConfirmRemove(null)}
                    tone="warning"
                />
            )}

            {confirmDelete && (
                <ConfirmModal
                    isOpen={!!confirmDelete}
                    title="Eliminar Lista"
                    message={`¿Estás seguro que deseas eliminar la lista "${confirmDelete.name}"? Esta acción no se puede deshacer.`}
                    onConfirm={async () => {
                        if (!confirmDelete) return
                        try {
                            await deleteMutation.mutateAsync(confirmDelete._id)
                            if (selectedListId === confirmDelete._id) setSelectedListId(null)
                            setConfirmDelete(null)
                        } catch (err) {
                            alert('Error: ' + err.message)
                        }
                    }}
                    onCancel={() => setConfirmDelete(null)}
                    tone="danger"
                />
            )}

            {prospectToDelete && (
                <ConfirmModal
                    isOpen={!!prospectToDelete}
                    title="Eliminar Prospecto"
                    message={`¿Estás seguro que deseas eliminar a "${prospectToDelete.name}" de forma permanente?`}
                    details={leadMemberships.length > 0
                        ? `Este prospecto forma parte de ${leadMemberships.length} lista(s): ${leadMemberships.map(l => l.name).join(', ')}.`
                        : "Esta acción lo eliminará de todo el sistema y de cualquier lista a la que pertenezca."
                    }
                    confirmText="Eliminar permanentemente"
                    onConfirm={handleDeleteLead}
                    onCancel={() => setProspectToDelete(null)}
                    tone="danger"
                    isLoading={leadDeleteMutation.isPending}
                />
            )}

            {selectedLead && (
                <LeadDetailModal
                    lead={selectedLead}
                    isOpen={!!selectedLead}
                    onClose={() => setSelectedLead(null)}
                />
            )}
        </div>
    )
}

export default Leads
