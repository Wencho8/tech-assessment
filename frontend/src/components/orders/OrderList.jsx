import { useState } from "react";
import { useOrders, useChangeOrderState } from "../../hooks/ordersHooks";
import styles from "../orders/OrderList.module.css";
import { useAuth } from "../../auth/useAuth";
import OrderDetailsModal from "./OrderDetailsModal";
import ConfirmationModal from "../common/ConfirmationModal";
import EditOrderModal from "./EditOrderModal";
import Spinner from "../common/Spinner";

export default function OrderList() {
  const { data: orders = [], isLoading, isError, error } = useOrders();
  const { mutate: changeOrderState } = useChangeOrderState();
  const [selectedOrderId, setSelectedOrderId] = useState(null);
  const [editingOrderId, setEditingOrderId] = useState(null);
  const [confirmModal, setConfirmModal] = useState({
    open: false,
    orderId: null,
    action: null,
    title: "",
    message: "",
  });
  const { getUser } = useAuth();
  const isAdmin = getUser()?.role === "admin";

  const handleActionClick = (orderId, action) => {
    if (action === "complete") {
      setConfirmModal({
        open: true,
        orderId,
        action,
        title: "Complete Order",
        message: `Are you sure you want to mark order #${orderId} as completed?`,
      });
    } else if (action === "cancel") {
      setConfirmModal({
        open: true,
        orderId,
        action,
        title: "Cancel Order",
        message: `Are you sure you want to cancel order #${orderId}?`,
      });
    }
  };

  const handleConfirmAction = () => {
    const { orderId, action } = confirmModal;
    changeOrderState(
      { orderId, action },
      {
        onSuccess: () => {
          setConfirmModal({ ...confirmModal, open: false });
        },
        onError: (err) => {
          console.error(`Error:`, err);
          setConfirmModal({
            ...confirmModal,
            open: true,
            title: "Error",
            message: `Failed to ${action} order #${orderId}. Please try again later.`,
          });
        },
      }
    );
  };

  const handleCancelAction = () => {
    setConfirmModal({ ...confirmModal, open: false });
  };

  if (isLoading) return <Spinner />;
  if (isError) return <p>Error: {error.message}</p>;

  return (
    <div>
      <h2 className={styles.title}>Orders</h2>
      {orders.length === 0 && <p>You don't have orders yet</p>}
      {orders.length !== 0 && (
        <table className={styles.table}>          
          <thead>
            <tr>
              <th>ID</th>
              <th>Total Price</th>
              <th>Placed At</th>
              {isAdmin && <th>User Email</th>}
              <th>Details</th>
              <th>Status</th>
              {!isAdmin && <th>Actions</th>}
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.id}>
                <td>{order.id}</td>
                <td>${order.total_price}</td>
                <td>{new Date(order.placed_at).toLocaleString()}</td>
                {isAdmin && <td>{order.user_email}</td>}
                <td>
                  <button
                    className={styles.viewButton}
                    onClick={() => setSelectedOrderId(order.id)}
                  >
                    View
                  </button>
                </td>                
                <td>
                  <span
                    className={styles.statusBadge}
                    style={{
                      fontWeight: "bold",
                      color:
                        order.state === "completed"
                          ? "green"
                          : order.state === "canceled"
                          ? "red"
                          : order.state === "pending"
                          ? "orange"
                          : "black",
                    }}
                  >
                    {order.state.toUpperCase()}
                  </span>
                </td>
                {!isAdmin && (
                  <td>
                    {order.state === "pending" && (
                      <div className={styles.actionButtons}>
                        <button
                          className={styles.completeButton}
                          onClick={() => handleActionClick(order.id, "complete")}
                        >
                          Complete
                        </button>
                        <button
                          className={styles.cancelButton}
                          onClick={() => handleActionClick(order.id, "cancel")}
                        >
                          Cancel
                        </button>
                        <button
                          className={styles.editButton}
                          onClick={() => setEditingOrderId(order.id)}
                        >
                          Edit
                        </button>
                      </div>
                    )}
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      )}
      {selectedOrderId && (
        <OrderDetailsModal
          orderId={selectedOrderId}
          onClose={() => setSelectedOrderId(null)}
        />
      )}
      {editingOrderId && (
        <EditOrderModal
          orderId={editingOrderId}
          onClose={() => setEditingOrderId(null)}
        />
      )}
      <ConfirmationModal
        open={confirmModal.open}
        title={confirmModal.title}
        message={confirmModal.message}
        onConfirm={handleConfirmAction}
        onCancel={handleCancelAction}
      />
    </div>
  );
}
