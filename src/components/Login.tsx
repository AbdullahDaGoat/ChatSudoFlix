import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface LoginProps {
  onLoginSuccess: () => void;
}

const Login: React.FC<LoginProps> = ({ onLoginSuccess }) => {
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const response = await fetch('http://localhost:3001/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
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
        <div className="flex items-center justify-center min-h-screen bg-gray-200">
            <div className="p-6 max-w-sm mx-auto bg-white rounded-xl shadow-md space-y-4">
                <h1 className="text-center text-xl font-bold">Enter Password to Access Chat</h1>
                <form onSubmit={handleSubmit}>
                    <div>
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
                        <input
                            type="password"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="mt-1 p-2 block w-full border border-gray-300 rounded-md shadow-sm"
                        />
                    </div>
                    <button type="submit" className="w-full mt-4 bg-blue-500 text-white p-2 rounded-md">Enter</button>
                </form>
            </div>
        </div>
    );
};

export default Login;