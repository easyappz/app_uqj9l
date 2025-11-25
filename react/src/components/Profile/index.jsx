import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getMe } from '../../api/getMe';
import './styles.css';

export const Profile = () => {
  const [member, setMember] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          navigate('/login');
          return;
        }

        const data = await getMe();
        setMember(data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching profile:', err);
        setError('Не удалось загрузить профиль');
        setLoading(false);
        
        if (err.response && err.response.status === 401) {
          localStorage.removeItem('token');
          navigate('/login');
        }
      }
    };

    fetchProfile();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ru-RU', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="profile-container" data-easytag="id1-react/src/components/Profile/index.jsx">
        <div className="profile-loading">Загрузка...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="profile-container" data-easytag="id1-react/src/components/Profile/index.jsx">
        <div className="profile-error">{error}</div>
      </div>
    );
  }

  return (
    <div className="profile-container" data-easytag="id1-react/src/components/Profile/index.jsx">
      <div className="profile-sidebar">
        <div className="profile-nav">
          <button className="nav-button" onClick={() => navigate('/chat')}>Чат</button>
          <button className="nav-button active">Профиль</button>
        </div>
      </div>
      
      <div className="profile-content">
        <div className="profile-header">
          <h1>Мой профиль</h1>
        </div>
        
        <div className="profile-card">
          <div className="profile-avatar">
            <div className="avatar-placeholder">
              {member?.username?.charAt(0).toUpperCase()}
            </div>
          </div>
          
          <div className="profile-info">
            <div className="info-section">
              <label className="info-label">Имя пользователя</label>
              <div className="info-value">{member?.username}</div>
            </div>
            
            <div className="info-section">
              <label className="info-label">Логин</label>
              <div className="info-value">{member?.login}</div>
            </div>
            
            <div className="info-section">
              <label className="info-label">Дата регистрации</label>
              <div className="info-value">
                {member?.created_at ? formatDate(member.created_at) : 'Не указана'}
              </div>
            </div>
          </div>
          
          <div className="profile-actions">
            <button className="logout-button" onClick={handleLogout}>
              Выйти из аккаунта
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
