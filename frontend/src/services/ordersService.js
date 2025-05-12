/**
 * Service for managing API requests related to orders.
 * A token is required for authentication.
 */

import axios from "axios";
import endpoints from "../config/api";

const getOrders = async (token) => {
  const response = await axios.get(endpoints.orders, {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });
  return response.data;
};

const createOrder = async ({ token, orderData }) => {
  const response = await axios.post(endpoints.orders, orderData, {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });
  return response.data;
};

const changeOrderState = async ({ token, orderId, action }) => {
  const response = await axios.post(
    `${endpoints.orders}/${orderId}/${action}`,
    {},
    {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    }
  );
  return response.data;
};

const editOrder = async ({ token, orderId, orderData }) => {
  const response = await axios.patch(
    `${endpoints.orders}/${orderId}`,
    orderData,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    }
  );
  return response.data;
};

export { getOrders, createOrder, changeOrderState, editOrder };