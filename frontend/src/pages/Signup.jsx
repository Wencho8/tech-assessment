import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import AuthForm from '../components/auth/AuthForm';
import endpoints from '../config/api';

const Signup = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    document.title = 'OrdersApp - Signup';
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    try {
      await axios.post(`${endpoints.users}/signup`, {
        user: {
          email,
          password,
        },
      });
      navigate('/');
    } catch (error) {
      console.error('Signup error:', error);
      setErrorMessage(error.response?.data?.errors?.[0] || 'An error occurred during signup.');
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
        linkText="Already have an account?"
        linkTo="/"
        buttonText="Signup"
      />
    </div>
  );
};

export default Signup;
