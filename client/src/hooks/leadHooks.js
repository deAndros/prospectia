import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { leadApi } from '../lib/api';

/**
 * Hook to fetch all leads
 */
export const useLeads = () => {
  return useQuery({
    queryKey: ['leads'],
    queryFn: leadApi.getAll,
  });
};

/**
 * Hook to discover leads via AI
 */
export const useDiscoverLeads = () => {
  return useMutation({
    mutationFn: (data) => leadApi.discover(data),
  });
};

/**
 * Hook to save leads to database
 */
export const useSaveLeads = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data) => leadApi.save(data),
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
    mutationFn: ({ id, data }) => leadApi.update(id, data),
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
    mutationFn: (id) => leadApi.delete(id),
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
    mutationFn: (id) => leadApi.analyze(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['leads'] });
    },
  });
};
