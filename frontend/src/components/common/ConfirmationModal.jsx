import styles from './ConfirmationModal.module.css'

export default function ConfirmationModal({
  open,
  title = 'Confirm',
  message,
  onConfirm,
  onCancel,
  isInfo = false,
}) {
  if (!open) return null
  return (
    <div className={styles.overlay} onClick={onCancel}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <h3 className={styles.title}>{title}</h3>
        <p className={styles.message}>{message}</p>
        <div className={styles.buttons}>
          {isInfo ? (
            <button className={styles.confirmOk} onClick={onConfirm}>
              OK
            </button>
          ) : (
            <>
              <button className={styles.cancel} onClick={onCancel}>
                No
              </button>
              <button className={styles.confirm} onClick={onConfirm}>
                Yes
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
