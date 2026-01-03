import { useMemo, useState } from 'react'
import { Users } from 'lucide-react'
import {
    useLists,
    useListOptions,
    useLeadsForLists,
    useCreateList,
    useUpdateList,
    useDeleteList,
} from '../hooks/useLists'

// Core Components
import ConfirmModal from '../components/ConfirmModal'
import LeadDetailModal from '../components/LeadDetailModal'

// List-specific modular components
import ListsSidebar from '../components/Lists/ListsSidebar'
import ProspectTable from '../components/Lists/ProspectTable'
import Wizard from '../components/Lists/Wizard'
import AddProspectModal from '../components/Lists/AddProspectModal'

const Lists = () => {
    // Queries
    const { data: lists = [] } = useLists()
    const { data: options = { countries: [], niches: [] } } = useListOptions()
    const { data: leads = [] } = useLeadsForLists()

    // Mutations
    const createMutation = useCreateList()
    const updateMutation = useUpdateList()
    const deleteMutation = useDeleteList()

    // UI State
    const [selectedListId, setSelectedListId] = useState(null)
    const [listSearch, setListSearch] = useState('')
    const [sortBy, setSortBy] = useState('newest') // newest | alpha
    const [showWizard, setShowWizard] = useState(false)
    const [showAddModal, setShowAddModal] = useState(false)
    const [confirmDelete, setConfirmDelete] = useState(null)
    const [selectedLead, setSelectedLead] = useState(null)

    // Memoized Data
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

    // Handlers
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

    const handleDeleteList = async () => {
        if (!confirmDelete) return
        try {
            await deleteMutation.mutateAsync(confirmDelete._id)
            if (selectedListId === confirmDelete._id) setSelectedListId(null)
            setConfirmDelete(null)
        } catch (err) {
            alert('Error: ' + err.message)
        }
    }

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

                {/* Center Content */}
                <div className="flex-1 flex flex-col min-w-0 pt-4 px-2">
                    <div className="mb-8 flex items-end justify-between">
                        <div className="flex items-center gap-3 bg-white/5 border border-white/10 px-6 py-3 rounded-3xl backdrop-blur-xl">
                            <span className="text-lg font-black text-white uppercase tracking-tighter">
                                {selectedList ? selectedList.name : 'Todos los prospectos'}
                            </span>
                            <div className="flex items-center gap-1.5 ml-4 pl-4 border-l border-white/10">
                                <Users size={16} className="text-indigo-400" />
                                <span className="text-sm font-black text-indigo-300 bg-indigo-500/10 px-3 py-1 rounded-xl shadow-inner">{tableLeads.length}</span>
                            </div>
                        </div>

                        {selectedList && (
                            <div className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest mb-1 mr-2 italic">
                                Sincronizado vía Waalaxy Engine
                            </div>
                        )}
                    </div>

                    <ProspectTable
                        leads={tableLeads}
                        selectedList={selectedList}
                        onRemove={handleRemoveFromList}
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

            {confirmDelete && (
                <ConfirmModal
                    isOpen={!!confirmDelete}
                    title="Eliminar Lista"
                    message={`¿Estás seguro que deseas eliminar la lista "${confirmDelete.name}"? Esta acción no se puede deshacer.`}
                    onConfirm={handleDeleteList}
                    onCancel={() => setConfirmDelete(null)}
                    tone="danger"
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

export default Lists
