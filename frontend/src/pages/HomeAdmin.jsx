import OrderList from '../components/orders/OrderList';
import ItemsList from '../components/items/ItemsList';
import styles from './HomeAdmin.module.css';
import { useEffect } from 'react';

function HomeAdmin() {
    useEffect(() => {
        document.title = 'OrdersApp - Admin Dashboard';
    }, []);

    return (
        <div className={styles.container}>
            <h1 className={styles.title}>Admin Dashboard</h1>
            <div className={styles.listsContainer}>
                <div className={styles.orderList}>
                    <OrderList />
                </div>
                <div className={styles.itemsList}>
                    <ItemsList />
                </div>
            </div>
        </div>
    );
}

export default HomeAdmin;
