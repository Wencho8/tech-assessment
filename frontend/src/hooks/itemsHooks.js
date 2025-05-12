import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getItems, createItem, updateItem, deleteItem } from '../services/itemsService';
import { useAuth } from '../auth/useAuth';

/**
 * Hook to fetch all items from the API
 * Uses React Query for data fetching and caching
 * @returns {Object} React Query result with data, loading and error states
 */
export function useItems() {
  const { getUser } = useAuth();
  const token = getUser()?.token;

  return useQuery({
    queryKey: ['items', token],
    queryFn: () => getItems(token),
    enabled: !!token,
  });
}

/**
 * Hook to create a new item
 * @param {Function} onSuccess - Optional callback to run after successful creation
 * @returns {Object} React Query mutation object with mutate function and states
 */
export const useCreateItem = (onSuccess) => {
  const { getUser } = useAuth();
  const token = getUser()?.token;
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (itemData) => createItem(token, itemData),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['items'] });
      onSuccess?.(data);
    },
  });
};

/**
 * Hook to update an existing item
 * @param {Function} onSuccess - Optional callback to run after successful update
 * @returns {Object} React Query mutation object with mutate function and states
 */
export const useEditItem = (onSuccess) => {
  const { getUser } = useAuth();
  const token = getUser()?.token;
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ itemId, itemData }) => updateItem(token, itemId, itemData),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['items'] });
      onSuccess?.(data);
    },
  });
};

/**
 * Hook to delete an item
 * @param {Function} onSuccess - Optional callback to run after successful deletion
 * @returns {Object} React Query mutation object with mutate function and states
 */
export const useDeleteItem = (onSuccess) => {
  const { getUser } = useAuth();
  const token = getUser()?.token;
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ( itemId ) => deleteItem(token, itemId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['items'] });
      onSuccess?.();
    },
  });
};
