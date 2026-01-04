import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { leadApi } from '../lib/api';

/**
 * Hook para obtener todos los prospectos
 */
export const useLeads = () => {
  return useQuery({
    queryKey: ['leads'],
    queryFn: leadApi.getAll,
  });
};

/**
 * Hook para descubrir prospectos vía IA
 */
export const useDiscoverLeads = () => {
  return useMutation({
    mutationFn: (data) => leadApi.discover(data),
  });
};

/**
 * Hook para guardar prospectos en la base de datos
 */
export const useSaveLeads = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data) => leadApi.save(data),
    onSuccess: () => {
      // Invalidar lista de prospectos para activar una recarga
      queryClient.invalidateQueries({ queryKey: ['leads'] });
    },
  });
};

/**
 * Hook para actualizar un prospecto
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
 * Hook para eliminar un prospecto
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
 * Hook para analizar un prospecto con IA
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
