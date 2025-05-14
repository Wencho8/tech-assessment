import { useState } from "react";
import styles from "./NewItemForm.module.css";

export default function NewItemForm({ onCreate }) {
  const [newItem, setNewItem] = useState({ name: "", price: "" });

  const handleCreateClick = () => {
    onCreate(newItem);
    setNewItem({ name: "", price: "" });
  };

  return (
    <form className={styles.newItemForm}>
      <div className={styles.inputsContainer}>
        <input
          type="text"
          className={styles.name}
          placeholder="Name"
          value={newItem.name}
          onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
        />
        <input
          type="number"
          className={styles.price}
          placeholder="Price"
          value={newItem.price}
          onChange={(e) => {
            const value = parseFloat(e.target.value);
            setNewItem({ ...newItem, price: value >= 0 ? value : "" });
          }}
        />
      </div>
      <button
        type="button"
        onClick={handleCreateClick}
        disabled={!newItem.name || !newItem.price}
      >
        Create
      </button>
    </form>
  );
}
