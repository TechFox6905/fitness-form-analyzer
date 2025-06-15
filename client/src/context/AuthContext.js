import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [userId, setUserId] = useState(null);
  const [userName, setUserName] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const storedUserId = localStorage.getItem('userId');
    if (storedUserId) {
      setUserId(storedUserId);
      fetchUserDetails(storedUserId);
    }
    setIsLoading(false);
  }, []);

  const fetchUserDetails = async (id) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;

      const response = await axios.get(`http://localhost:5000/auth/user/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUserName(response.data.name);
    } catch (error) {
      console.error('Error fetching user details:', error);
    }
  };

  const login = (token, id, name) => {
    localStorage.setItem('token', token);
    localStorage.setItem('userId', id);
    setUserId(id);
    setUserName(name);
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    setUserId(null);
    setUserName('');
  };

  return (
    <AuthContext.Provider value={{ userId, userName, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}; 