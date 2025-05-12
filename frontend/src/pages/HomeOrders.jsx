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
  const [successModal, setSuccessModal] = useState(false);
  const [errorModal, setErrorModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const { mutate: createOrder } = useAddOrder();

  useEffect(() => {
      document.title = "OrdersApp - Home";
  }, []);

  const handleConfirm = (orderPayload) => {
    createOrder(orderPayload, {
      onSuccess: () => {
        setShowNew(false);
        setSuccessModal(true);
      },
      onError: (error) => {
        setErrorMessage(error.message || "An error occurred while creating the order.");
        setErrorModal(true);
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
          {!showNew && <button
            className={styles.newOrderButton}
            onClick={() => setShowNew((v) => !v)}
          >
            Create a New Order
          </button> }
          {showNew && (
            <NewOrderForm
              onConfirm={handleConfirm}
              onCancel={() => setShowNew(false)}
            />
          )}
        </div>
      </div>
      <ConfirmationModal
        open={successModal}
        title="Success"
        message="Your order has been created successfully! ✔️"
        isInfo={true}
        onConfirm={() => setSuccessModal(false)}
        onCancel={() => setSuccessModal(false)}
      />
      <ConfirmationModal
        open={errorModal}
        title="Error"
        message={errorMessage}
        isInfo={true}
        onConfirm={() => setErrorModal(false)}
        onCancel={() => setErrorModal(false)}
      />
    </div>
  );
}

export default HomeOrders;
