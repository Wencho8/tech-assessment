import { useState, useEffect } from "react";
import { useItems } from "../../hooks/itemsHooks";
import { useEditOrder } from "../../hooks/ordersHooks";
import { useOrderCalculations } from "../../hooks/useOrderCalculations";
import { useAuth } from "../../auth/useAuth";
import axios from "axios";
import endpoints from "../../config/api";
import ConfirmationModal from "../common/ConfirmationModal";
import OrderItemsList from "./OrderItemsList";
import styles from "./EditOrderModal.module.css";
import Spinner from "../common/Spinner";

export default function EditOrderModal({ orderId, onClose }) {
  const { getUser } = useAuth();
  const token = getUser()?.token;
  const { mutate: editOrder } = useEditOrder();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [quantities, setQuantities] = useState({});
  const [confirmModal, setConfirmModal] = useState({
    open: false,
    action: null,
    title: "",
    message: "",
  });
  const { data: items = [], isLoading: itemsLoading } = useItems();

  useEffect(() => {
    if (!orderId) return;

    const fetchOrder = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await axios.get(`${endpoints.orders}/${orderId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setOrder(res.data);

        const initialQuantities = {};
        res.data.order_items.forEach((orderItem) => {
          initialQuantities[orderItem.item.id] = orderItem.quantity;
        });
        setQuantities(initialQuantities);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [orderId, token]);
  const { total, selectedItems } = useOrderCalculations(items, quantities);
  const handleChange = (id, value) => {
    const q = Math.max(0, Math.floor(value));
    setQuantities((qs) => ({ ...qs, [id]: q }));
  };

  const handleActionClick = (action) => {
    if (action === "cancel") {
      setConfirmModal({
        open: true,
        action,
        title: "Discard changes?",
        message: "Are you sure you want to cancel editing this order?",
      });
    } else if (action === "save") {
      setConfirmModal({
        open: true,
        action,
        title: "Save changes?",
        message: "Are you sure you want to save the changes to this order?",
      });
    }
  };

  const handleConfirmAction = () => {
    const { action } = confirmModal;

    if (action === "cancel") {
      setConfirmModal({ ...confirmModal, open: false });
      onClose();
    } else if (action === "save") {
      editOrder(
        {
          orderId,
          orderData: {
            order: {
              items: selectedItems.map(({ id, quantity }) => ({
                id,
                quantity,
              })),
            },
          },
        },
        {
          onSuccess: () => {
            setConfirmModal({ ...confirmModal, open: false });
            onClose();
          },
          onError: (err) => {
            console.error("Error updating order:", err);
            setError(err);
            setConfirmModal({ ...confirmModal, open: false });
          },
        }
      );
    }
  };

  const handleCancelAction = () => {
    setConfirmModal({ ...confirmModal, open: false });
  };

  if (!orderId) return null;

  if (loading || itemsLoading)
    return (
      <div className={styles.overlay}>
        <div className={styles.modal}>
          <Spinner />
        </div>
      </div>
    );

  if (error)
    return (
      <div className={styles.overlay}>
        <div className={styles.modal}>
          <p className={styles.error}>Error: {error.message}</p>
          <button className={styles.close} onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    );

  return (
    <>
      <div
        className={styles.overlay}
        onClick={() => handleActionClick("cancel")}
      >
        <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
          <h2>Edit Order #{orderId}</h2>
          <OrderItemsList
            items={items}
            quantities={quantities}
            handleChange={handleChange}
            total={total}
          />
          <div className={styles.buttons}>
            <button
              onClick={() => handleActionClick("cancel")}
              className={styles.cancel}
            >
              Cancel
            </button>
            <button
              onClick={() => handleActionClick("save")}
              className={styles.save}
              disabled={total === 0}
            >
              Save Changes
            </button>
          </div>
        </div>
      </div>
      <ConfirmationModal
        open={confirmModal.open}
        title={confirmModal.title}
        message={confirmModal.message}
        onConfirm={handleConfirmAction}
        onCancel={handleCancelAction}
      />
    </>
  );
}
