import { useState, useEffect } from 'react'
import axios from 'axios'
import { useAuth } from '../../auth/useAuth'
import styles from '../orders/OrderDetailsModal.module.css'
import Spinner from '../common/Spinner'
import endpoints from '../../config/api'

export default function OrderDetailsModal({ orderId, onClose }) {
  const { getUser } = useAuth()
  const token = getUser()?.token

  const [order, setOrder] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!orderId) return

    const fetchOrder = async () => {
      setLoading(true)
      setError(null)
      try {
        const res = await axios.get(
          `${endpoints.orders}/${orderId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        )
        setOrder(res.data)
      } catch (err) {
        setError(err)
      } finally {
        setLoading(false)
      }
    }

    fetchOrder()
  }, [orderId, token])

  if (!orderId) return null

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <button className={styles.close} onClick={onClose}>×</button>

        {loading && <Spinner/>}
        {error && <p className={styles.error}>Error: {error.message}</p>}

        {order && (
          <div className={styles.content}>
            <h2>Order #{order.id}</h2>
            <p><strong>Total:</strong> ${order.total_price}</p>
            <p><strong>Placed at:</strong> {new Date(order.created_at).toLocaleString()}</p>

            <h3>Items</h3>
            <table className={styles.itemsTable}>
              <thead>
                <tr>
                  <th>Item ID</th>
                  <th>Name</th>
                  <th>Qty</th>
                  <th>Unit Price</th>
                </tr>
              </thead>
              <tbody>
                {order.order_items.map((oi, i) => (
                  <tr key={i}>
                    <td>{oi.item.id}</td>
                    <td>{oi.item.name}</td>
                    <td>{oi.quantity}</td>
                    <td>${oi.unit_price}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            {order.user?.email && (
              <>
                <h3>User</h3>
                <p>{order.user.email}</p>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
