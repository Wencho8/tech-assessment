/**
 * This file contains the API endpoints for the application.
 */

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';

const endpoints = {
  items: `${API_BASE_URL}/items`,
  orders: `${API_BASE_URL}/orders`,
  users: `${API_BASE_URL}/users`,
};

export default endpoints;
