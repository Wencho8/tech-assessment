import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getOrders, createOrder, changeOrderState, editOrder } from '../services/ordersService';
import { useAuth } from '../auth/useAuth';

/**
 * Hook to fetch all orders from the API
 * Uses React Query for data fetching and caching
 * @returns {Object} React Query result with data, loading and error states
 */
export function useOrders() {
  const { getUser } = useAuth();
  const token = getUser().token;

  return useQuery({
    queryKey: ['orders', token],
    queryFn: () => getOrders(token),
    enabled: !!token
  });
}

/**
 * Hook to create a new order
 * @param {Function} onSuccess - Optional callback to run after successful creation
 * @returns {Object} React Query mutation object with mutate function and states
 */
export function useAddOrder(onSuccess) {
  const { getUser } = useAuth();
  const token = getUser().token;
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (orderData) => createOrder({ token, orderData }),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      onSuccess?.(data);
    },
  });
}

/**
 * Hook to change an order's state (complete or cancel)
 * @param {Function} onSuccess - Optional callback to run after successful state change
 * @returns {Object} React Query mutation object with mutate function and states
 */
export function useChangeOrderState(onSuccess) {
  const { getUser } = useAuth();
  const token = getUser().token;
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ orderId, action }) => changeOrderState({ token, orderId, action }),
    onSuccess: (data) => {
      // Invalidate and refetch orders after changing state
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      onSuccess?.(data); // Call optional success callback
    },
  });
}

/**
 * Hook to edit an existing order
 * @param {Function} onSuccess - Optional callback to run after successful edit
 * @returns {Object} React Query mutation object with mutate function and states
 */
export function useEditOrder(onSuccess) {
  const { getUser } = useAuth();
  const token = getUser().token;
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ orderId, orderData }) => editOrder({ token, orderId, orderData }),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      onSuccess?.(data);
    },
  });
}

