import styles from './OrderItemsList.module.css';

export default function OrderItemsList({ items, quantities, handleChange, total }) {
  return (
    <>
      <div className={styles.list}>
        {items.map((item) => (
          <div key={item.id} className={styles.listItem}>
            <div className={styles.info}>
              <span className={styles.name}>{item.name}</span>
              <span className={styles.price}>
                ${(Number(item.price) || 0).toFixed(2)}
              </span>
            </div>
            <input
              type="number"
              min="0"
              value={quantities[item.id] || ''}
              placeholder="0"
              onChange={(e) => handleChange(item.id, e.target.value)}
              className={styles.qtyInput}
            />
          </div>
        ))}
      </div>
      {total !== undefined && (
        <div className={styles.summary}>
          <span>Total:</span>
          <span className={styles.totalPrice}>${total.toFixed(2)}</span>
        </div>
      )}
    </>
  );
}
