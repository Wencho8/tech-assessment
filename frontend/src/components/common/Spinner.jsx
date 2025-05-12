import styles from './Spinner.module.css';

export default function Spinner({ size = "medium", color }) {
  const spinnerClass = `${styles.spinner} ${styles[size]}`;
  
  const customStyle = color ? { borderTopColor: color } : {};
  
  return (
    <div className={styles.container}>
      <div className={spinnerClass} style={customStyle}></div>
    </div>
  );
}
