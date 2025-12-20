import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { leadsApi } from '../lib/api';

/**
 * Hook to fetch all leads
 */
export const useLeads = () => {
  return useQuery({
    queryKey: ['leads'],
    queryFn: leadsApi.getAll,
  });
};

/**
 * Hook to discover leads via AI
 */
export const useDiscoverLeads = () => {
  return useMutation({
    mutationFn: (data) => leadsApi.discover(data),
  });
};

/**
 * Hook to save leads to database
 */
export const useSaveLeads = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data) => leadsApi.save(data),
    onSuccess: () => {
      // Invalidate leads list to trigger a refetch
      queryClient.invalidateQueries({ queryKey: ['leads'] });
    },
  });
};

/**
 * Hook to update a lead
 */
export const useUpdateLead = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }) => leadsApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['leads'] });
    },
  });
};

/**
 * Hook to delete a lead
 */
export const useDeleteLead = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id) => leadsApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['leads'] });
    },
  });
};

/**
 * Hook to analyze a lead with AI
 */
export const useAnalyzeLead = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id) => leadsApi.analyze(id),
    onSuccess: (data) => {
      // Update specific lead in the cache if needed, or just invalidate
      queryClient.invalidateQueries({ queryKey: ['leads'] });
    },
  });
};
