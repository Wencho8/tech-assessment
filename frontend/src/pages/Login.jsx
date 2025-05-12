import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../auth/useAuth';
import { useNavigate } from 'react-router-dom';
import AuthForm from '../components/auth/AuthForm';
import endpoints from '../config/api';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const { saveUser } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    document.title = 'OrdersApp - Login';
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    try {
      const response = await axios.post(`${endpoints.users}/login`, {
        email,
        password,
      });
      saveUser({
        token: response.data.token,
        role: response.data.user.role,
        email: response.data.user.email,
      });

      if (response.data.user.role === 'admin') {
        navigate('/home-admin');
      } else {
        navigate('/home-orders');
      }
    } catch (error) {
      console.error('Login error:', error);
      setErrorMessage(error.response?.data?.errors?.[0] || 'An error occurred during login.');
    }
  };

  return (
    <div>
      <AuthForm
        email={email}
        setEmail={setEmail}
        password={password}
        setPassword={setPassword}
        errorMessage={errorMessage}
        handleSubmit={handleSubmit}
        linkText="Don’t have an account?"
        linkTo="/signup"
        buttonText="Login"
      />
    </div>
  );
};

export default Login;
