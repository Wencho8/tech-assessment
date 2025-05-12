/**
 * Service for managing API requests related to items.
 * A token is required for authentication.
 */

import axios from 'axios';
import endpoints from "../config/api";

const getItems = async (token) => {
  const response = await axios.get(endpoints.items, {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });
  return response.data;
};

const createItem = async (token, itemData) => {
  const response = await axios.post(endpoints.items, itemData, {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });
  return response.data;
};

const updateItem = async (token, itemId, itemData) => {
  const response = await axios.patch(`${endpoints.items}/${itemId}`, itemData, {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });
  return response.data;
};

const deleteItem = async (token, itemId) => {
  const response = await axios.delete(`${endpoints.items}/${itemId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });
  return response.data;
};

export { getItems, createItem, updateItem, deleteItem };
