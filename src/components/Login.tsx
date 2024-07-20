import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLock, faSignInAlt, faSun, faMoon } from '@fortawesome/free-solid-svg-icons';

interface LoginProps {
  onLoginSuccess: () => void;
  isDarkMode: boolean;
  toggleTheme: () => void;
}

const Login: React.FC<LoginProps> = ({ onLoginSuccess, isDarkMode, toggleTheme }) => {
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const response = await fetch('http://localhost:3001/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ password }),
            });
            const result = await response.json();
            if (result.success) {
                onLoginSuccess();
                navigate('/chat');
            } else {
                alert('Invalid password');
            }
        } catch (error) {
            console.error('Error during login:', error);
            alert('An error occurred. Please try again.');
        }
    };

    return (
        <div className={`flex items-center justify-center min-h-screen ${isDarkMode ? 'dark bg-gray-900' : 'bg-peach-50'}`}>
            <div className={`p-8 max-w-sm w-full mx-auto rounded-xl shadow-md space-y-6 ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
                <div className="flex justify-between items-center">
                    <h1 className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-peach-800'}`}>
                        <FontAwesomeIcon icon={faLock} className="mr-2" />
                        Chat Access
                    </h1>
                    <button onClick={toggleTheme} className={`p-2 rounded-full ${isDarkMode ? 'bg-yellow-400 text-gray-900' : 'bg-gray-800 text-yellow-400'}`}>
                        <FontAwesomeIcon icon={isDarkMode ? faSun : faMoon} />
                    </button>
                </div>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="password" className={`block text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Password</label>
                        <input
                            type="password"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className={`mt-1 p-2 block w-full border rounded-md shadow-sm focus:ring-2 focus:ring-peach-500 focus:border-peach-500 ${isDarkMode ? 'bg-gray-700 text-white border-gray-600' : 'bg-white text-gray-900 border-gray-300'}`}
                        />
                    </div>
                    <button 
                        type="submit" 
                        className={`w-full p-2 rounded-md transition-colors duration-200 flex items-center justify-center ${isDarkMode ? 'bg-peach-600 hover:bg-peach-700' : 'bg-peach-500 hover:bg-peach-600'} text-white`}
                    >
                        <FontAwesomeIcon icon={faSignInAlt} className="mr-2" />
                        Enter Chat
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Login;