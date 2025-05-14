import { useState } from "react";
import { useItems } from "../../hooks/itemsHooks";
import { useOrderCalculations } from "../../hooks/useOrderCalculations";
import ConfirmationModal from "../common/ConfirmationModal";
import OrderSummaryModal from "./OrderSummaryModal";
import OrderItemsList from "./OrderItemsList";
import styles from "../orders/NewOrderForm.module.css";
import Spinner from "../common/Spinner";

export default function NewOrderForm({ onConfirm, onCancel }) {
  const { data: items = [], isLoading, isError, error } = useItems();
  const [quantities, setQuantities] = useState({});
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [showSummaryModal, setShowSummaryModal] = useState(false);

  const { total, selectedItems } = useOrderCalculations(items, quantities);

  const handleChange = (id, value) => {
    const q = Math.max(0, Math.floor(value));
    setQuantities((qs) => ({ ...qs, [id]: q }));
  };

  const handleCancelClick = () => {
    setShowCancelModal(true);
  };
  const confirmCancel = () => {
    setShowCancelModal(false);
    onCancel();
  };

  const handleConfirmClick = () => {
    setShowSummaryModal(true);
  };
  const finalizeOrder = () => {
    onConfirm({
      order: {
        items: selectedItems.map(({ id, quantity }) => ({ id, quantity })),
      },
    });
    setShowSummaryModal(false);
  };

  if (isLoading) return <Spinner />;
  if (isError) return <p>Error: {error.message}</p>;

  return (
    <>
      <div className={styles.container}>
        <h2>Create New Order</h2>
        <OrderItemsList
          items={items}
          quantities={quantities}
          handleChange={handleChange}
          total={total}
        />
        <div className={styles.buttons}>
          <button onClick={handleCancelClick} className={styles.cancel}>
            Cancel
          </button>
          <button
            onClick={handleConfirmClick}
            className={styles.confirm}
            disabled={total === 0}
          >
            Confirm
          </button>
        </div>
      </div>
      <ConfirmationModal
        open={showCancelModal}
        title="Discard changes?"
        message="Are you sure you want to cancel creating this order?"
        onConfirm={confirmCancel}
        onCancel={() => setShowCancelModal(false)}
      />
      <OrderSummaryModal
        open={showSummaryModal}
        items={selectedItems}
        total={total}
        onCancel={() => setShowSummaryModal(false)}
        onCreate={finalizeOrder}
      />
    </>
  );
}
