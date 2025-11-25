import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { login } from '../../api/login';
import './styles.css';

export const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    login: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await login(formData);
      localStorage.setItem('token', response.token);
      navigate('/chat');
    } catch (err) {
      setError(err.response?.data?.error || 'Ошибка входа');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container" data-easytag="id1-react/src/components/Login/index.jsx">
      <div className="auth-card">
        <div className="auth-header">
          <h1 className="auth-title">С возвращением!</h1>
          <p className="auth-subtitle">Мы так рады видеть тебя снова!</p>
        </div>

        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="login" className="form-label">
              Логин
            </label>
            <input
              type="text"
              id="login"
              name="login"
              className="form-input"
              value={formData.login}
              onChange={handleChange}
              required
              placeholder="Введите свой логин"
              disabled={loading}
            />
          </div>

          {error && (
            <div className="error-message">
              {error}
            </div>
          )}

          <button
            type="submit"
            className="auth-button"
            disabled={loading}
          >
            {loading ? 'Вход...' : 'Войти'}
          </button>
        </form>

        <div className="auth-footer">
          <span className="auth-footer-text">Нужен аккаунт?</span>
          <Link to="/register" className="auth-link">
            Зарегистрироваться
          </Link>
        </div>
      </div>
    </div>
  );
};
