import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { listApi, leadApi } from '../lib/api'

const LISTS_KEY = ['lists']
const LISTS_OPTIONS_KEY = ['listsOptions']
const LEADS_KEY = ['leads']
const LEAD_FILTERS_KEY = ['leadFilters']

export const useLists = () =>
  useQuery({
    queryKey: LISTS_KEY,
    queryFn: listApi.getAll,
  })

export const useListOptions = () =>
  useQuery({
    queryKey: LISTS_OPTIONS_KEY,
    queryFn: listApi.getOptions,
  })

export const useLeadsForLists = () =>
  useQuery({
    queryKey: LEADS_KEY,
    queryFn: leadApi.getAll,
  })

export const useLeadFilters = () =>
  useQuery({
    queryKey: LEAD_FILTERS_KEY,
    queryFn: leadApi.getFilters,
  })

export const useCreateList = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: listApi.create,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: LISTS_KEY })
    },
  })
}

export const useUpdateList = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }) => listApi.update(id, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: LISTS_KEY })
      qc.invalidateQueries({ queryKey: LEADS_KEY })
    },
  })
}

export const useDeleteList = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id) => listApi.delete(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: LISTS_KEY })
    },
  })
}

