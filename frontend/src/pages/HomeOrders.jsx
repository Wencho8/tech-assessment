import { useState, useEffect } from "react";
import OrderList from "../components/orders/OrderList";
import NewOrderForm from "../components/orders/NewOrderForm";
import styles from "./HomeOrders.module.css";
import { useAuth } from "../auth/useAuth";
import { useAddOrder } from "../hooks/ordersHooks";
import ConfirmationModal from "../components/common/ConfirmationModal";

function HomeOrders() {
  const { getUser } = useAuth();
  const userEmail = getUser()?.email;
  const [showNew, setShowNew] = useState(false);
  const [confirmModal, setConfirmModal] = useState({
    open: false,
    title: "",
    message: "",
    isInfo: false,
    onOk: null,
  });

  const { mutate: createOrder } = useAddOrder();

  useEffect(() => {
    document.title = "OrdersApp - Home";
  }, []);

  const handleConfirm = (orderPayload) => {
    createOrder(orderPayload, {
      onSuccess: () => {
        setShowNew(false);
        setConfirmModal({
          open: true,
          title: "Success",
          message: "Your order has been created successfully! ✔️",
          isInfo: true,
          onOk: () => setConfirmModal((prev) => ({ ...prev, open: false })),
        });
      },
      onError: (error) => {
        const errorMsg =
          error.message || "An error occurred while creating the order.";
        setConfirmModal({
          open: true,
          title: "Error",
          message: errorMsg,
          isInfo: true,
          onOk: () => setConfirmModal((prev) => ({ ...prev, open: false })),
        });
      },
    });
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Welcome {userEmail}!</h1>
      <div className={styles.listsContainer}>
        <div className={styles.orderList}>
          <OrderList />
        </div>
        <div className={styles.newOrder}>
          {!showNew && (
            <button
              className={styles.newOrderButton}
              onClick={() => setShowNew((v) => !v)}
            >
              Create a New Order
            </button>
          )}
          {showNew && (
            <NewOrderForm
              onConfirm={handleConfirm}
              onCancel={() => setShowNew(false)}
            />
          )}
        </div>
      </div>
      <ConfirmationModal
        open={confirmModal.open}
        title={confirmModal.title}
        message={confirmModal.message}
        isInfo={confirmModal.isInfo}
        onConfirm={confirmModal.onOk}
        onCancel={confirmModal.onOk}
      />
    </div>
  );
}

export default HomeOrders;
