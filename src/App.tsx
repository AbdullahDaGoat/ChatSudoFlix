import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Login from './components/Login';
import Chat from './components/Chat';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    const savedTheme = localStorage.getItem('theme');
    try {
      return savedTheme ? JSON.parse(savedTheme) : false; // Default to false if null
    } catch (error) {
      console.error("Error parsing theme from localStorage:", error);
      return false; // Fallback in case of JSON parse error
    }
  });

  useEffect(() => {
    localStorage.setItem('theme', JSON.stringify(isDarkMode));
  }, [isDarkMode]);

  const toggleTheme = () => {
    setIsDarkMode(prevMode => !prevMode);
  };

  return (
    <Router>
      <div className={`App ${isDarkMode ? 'dark' : ''}`}>
        <Routes>
          <Route 
            path="/login" 
            element={
              <Login 
                onLoginSuccess={() => setIsAuthenticated(true)}
                isDarkMode={isDarkMode}
                toggleTheme={toggleTheme}
              />
            } 
          />
          <Route 
            path="/chat" 
            element={
              isAuthenticated ? (
                <Chat 
                  isDarkMode={isDarkMode} 
                  toggleTheme={toggleTheme} 
                />
              ) : (
                <Navigate to="/login" replace />
              )
            } 
          />
          <Route path="/" element={<Navigate to="/login" replace />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;