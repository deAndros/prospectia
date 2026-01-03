import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { listsApi, leadsApi } from '../lib/api'

const LISTS_KEY = ['lists']
const LISTS_OPTIONS_KEY = ['listsOptions']
const LEADS_KEY = ['leads']

export const useLists = () =>
  useQuery({
    queryKey: LISTS_KEY,
    queryFn: listsApi.getAll,
  })

export const useListOptions = () =>
  useQuery({
    queryKey: LISTS_OPTIONS_KEY,
    queryFn: listsApi.getOptions,
  })

export const useLeadsForLists = () =>
  useQuery({
    queryKey: LEADS_KEY,
    queryFn: leadsApi.getAll,
  })

export const useCreateList = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: listsApi.create,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: LISTS_KEY })
    },
  })
}

export const useUpdateList = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }) => listsApi.update(id, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: LISTS_KEY })
      qc.invalidateQueries({ queryKey: LEADS_KEY })
    },
  })
}

export const useDeleteList = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id) => listsApi.delete(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: LISTS_KEY })
    },
  })
}

