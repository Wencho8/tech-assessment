import {
  useItems,
  useEditItem,
  useDeleteItem,
  useCreateItem,
} from "../../hooks/itemsHooks";
import { useState } from "react";
import styles from "./ItemsList.module.css";
import NewItemForm from "./NewItemForm";
import Spinner from "../common/Spinner";
import ConfirmationModal from "../common/ConfirmationModal";

export default function ItemsList() {
  const { data: items = [], isLoading, isError, error } = useItems();

  const [editingItem, setEditingItem] = useState(null);
  const [editedData, setEditedData] = useState({ name: "", price: "" });
  const [showForm, setShowForm] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);

const {
  mutate: updateItem,
  isError: isUpdateError,
  error: updateError,
  reset: resetUpdateError,
} = useEditItem(() => setEditingItem(null));

const {
  mutate: deleteItem,
  isError: isDeleteError,
  error: deleteError,
  reset: resetDeleteError,
} = useDeleteItem();

const {
  mutate: createItem,
  isError: isCreateError,
  error: createError,
  reset: resetCreateError,
} = useCreateItem(() => setShowForm(false));

  const handleEditClick = (item) => {
    setEditingItem(item.id);
    setEditedData({ name: item.name, price: item.price });
  };

  const handleSaveClick = (itemId) => {
    resetUpdateError();
    updateItem({ itemId, itemData: editedData });
    setEditingItem(null);
  };

  const handleDeleteClick = (item) => {
    resetDeleteError();
    setItemToDelete(item);
  };

  const confirmDelete = () => {
    if (itemToDelete) {
      deleteItem(itemToDelete.id);
      setItemToDelete(null);
    }
  };

  const handleCreateClick = (newItem) => {
    resetCreateError();
    createItem(newItem);
  };

  if (isLoading) return <Spinner />;
  if (isError) return <p className={styles.error}>Error: {error?.response?.data?.error || error.message}</p>;

  return (
    <>
      <div>
        <div className={styles.header}>
          <h2 className={styles.title}>Items</h2>
          <button
            className={styles.newItemButton}
            onClick={() => setShowForm(!showForm)}
          >
            {showForm ? "Cancel" : "New Item +"}
          </button>
        </div>
        {showForm && <NewItemForm onCreate={handleCreateClick} />}
        <table className={styles.table}>
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Price</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={item.id}>
                <td>{item.id}</td>
                <td>
                  {editingItem === item.id ? (
                    <input
                      type="text"
                      value={editedData.name}
                      onChange={(e) =>
                        setEditedData({ ...editedData, name: e.target.value })
                      }
                    />
                  ) : (
                    item.name
                  )}
                </td>
                <td>
                  {editingItem === item.id ? (
                    <input
                      type="number"
                      value={editedData.price}
                      onChange={(e) =>
                        setEditedData({ ...editedData, price: e.target.value })
                      }
                    />
                  ) : (
                    `$${item.price}`
                  )}
                </td>
                <td>
                  <div className={styles.actions}>
                    {editingItem === item.id ? (
                      <button
                        className={styles.edit}
                        onClick={() => handleSaveClick(item.id)}
                      >
                        Save
                      </button>
                    ) : (
                      <button
                        className={styles.edit}
                        onClick={() => handleEditClick(item)}
                      >
                        Edit
                      </button>
                    )}
                    <button
                      className={styles.delete}
                      onClick={() => handleDeleteClick(item)}
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {(isUpdateError || isDeleteError || isCreateError) && (
          <div className={styles.error}>
            {isUpdateError && <p>Error updating item: {updateError?.response?.data?.error || updateError.message}</p>}
            {isDeleteError && <p>Error deleting item: {deleteError?.response?.data?.error || deleteError.message}</p>}
            {isCreateError && <p>Error creating item: {createError?.response?.data?.error || createError.message}</p>}
          </div>
        )}
      </div>
      <ConfirmationModal
        open={itemToDelete !== null}
        title="Delete Item"
        message={`Are you sure you want to delete ${itemToDelete?.name}?`}
        onConfirm={confirmDelete}
        onCancel={() => setItemToDelete(null)}
      />
    </>
  );
}
