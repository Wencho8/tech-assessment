import { useAuth } from '../../auth/useAuth';
import styles from '../common/Navbar.module.css';

const Navbar = () => {
  const { isAuthenticated, signout } = useAuth();

  const handleLogout = () => {
    signout();
  };

  return (
    <nav className={styles.navbar}>
      <h1 className={styles.title}>Orders App</h1>
      {isAuthenticated && (
        <button onClick={handleLogout} className={styles.logoutButton}>
          Logout
        </button>
      )}
    </nav>
  );
};

export default Navbar;
