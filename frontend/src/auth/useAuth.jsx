/**
 * Authentication context provider that manages user authentication state,
 * login/logout functionality and persists user data in local storage.
 */
import { useContext, createContext, useState, useEffect } from 'react';

const AuthContext = createContext({
  isAuthenticated: false,
  saveUser: (_userData) => {},
  getUser: () => ({}),
  signout: () => {},
});

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  function saveUser(userData) {
    const user = {
      token: userData.token,
      role: userData.role,
      email: userData.email,
    };
    setUser(user);
    localStorage.setItem('user', JSON.stringify(user));
    setIsAuthenticated(true);
  }

  function getUser() {
    const userStorage = localStorage.getItem('user');
    if (userStorage) {
      return JSON.parse(userStorage);
    }
    return null;
  }

  function signout() {
    localStorage.removeItem('user');
    setUser(null);
    setIsAuthenticated(false);
  }

  useEffect(() => {
    const storedUser = getUser();
    if (storedUser) {
      setUser(storedUser);
      setIsAuthenticated(true);
    }
  }, []);

  return (
    <AuthContext.Provider value={{ isAuthenticated, saveUser, getUser, signout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
