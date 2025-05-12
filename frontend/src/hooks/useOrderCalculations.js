import { useMemo } from 'react';

/**
 * Custom hook to calculate order totals and selectd items
 * 
 * @param {Array} items - List of all available items
 * @param {Object} quantities - Object mapping item IDs to quantities
 * @returns {Object} Objecçt containing total price and selected items array
 */
export function useOrderCalculations(items, quantities) {
  const total = useMemo(() => {
    return items.reduce((sum, item) => {
      const qty = quantities[item.id] || 0;
      return sum + qty * (Number(item.price) || 0);
    }, 0);
  }, [items, quantities]);

  const selectedItems = useMemo(
    () =>
      items
        .filter((it) => (quantities[it.id] || 0) > 0)
        .map((it) => ({
          id: it.id,
          name: it.name,
          price: Number(it.price) || 0,
          quantity: quantities[it.id],
        })),
    [items, quantities]
  );

  return { total, selectedItems };
}
