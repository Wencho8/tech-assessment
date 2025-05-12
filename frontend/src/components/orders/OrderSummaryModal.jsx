import styles from './OrderSummaryModal.module.css'

export default function OrderSummaryModal({
  open,
  items,
  total,
  onCreate,
  onCancel,
}) {
  if (!open) return null
  return (
    <div className={styles.overlay} onClick={onCancel}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <h3 className={styles.title}>Confirm New Order</h3>

        <div className={styles.list}>
          {items.map((it) => (
            <div key={it.id} className={styles.item}>
              <span className={styles.name}>{it.name}</span>
              <span className={styles.qty}>×{it.quantity}</span>
              <span className={styles.subtotal}>
                ${(it.price * it.quantity).toFixed(2)}
              </span>
            </div>
          ))}
        </div>

        <div className={styles.total}>
          <strong>Total:</strong> ${total.toFixed(2)}
        </div>

        <div className={styles.buttons}>
          <button className={styles.cancel} onClick={onCancel}>
            Back
          </button>
          <button className={styles.create} onClick={onCreate}>
            Create
          </button>
        </div>
      </div>
    </div>
  )
}