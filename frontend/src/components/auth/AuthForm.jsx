import { Link } from 'react-router-dom';
import styles from './AuthForm.module.css';

const AuthForm = ({ email, setEmail, password, setPassword, errorMessage, handleSubmit, linkText, linkTo, buttonText }) => {
  return (
    <div className={styles.container}>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        {errorMessage && <p className={styles.errorMessage}>{errorMessage}</p>}
        <button type="submit">{buttonText}</button>
        <p className={styles.linkText}>
          {linkText} <Link to={linkTo}>{buttonText === 'Login' ? 'Sign up' : 'Login'}</Link>
        </p>
      </form>
    </div>
  );
};

export default AuthForm;
