import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSun, faMoon, faComments } from '@fortawesome/free-solid-svg-icons'; // Import the faComments icon

interface ChatHeaderProps {
    isDarkMode: boolean;
    toggleTheme: () => void;
}

const ChatHeader: React.FC<ChatHeaderProps> = ({ isDarkMode, toggleTheme }) => {
    return (
        <div className="flex justify-between items-center mb-4">
            <h1 className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-peach-800'}`}>
                <FontAwesomeIcon icon={faComments} className="mr-2" /> {/* Add the chat icon here */}
                Chat Room
            </h1>
            <button onClick={toggleTheme} className={`p-2 rounded-full ${isDarkMode ? 'bg-yellow-400 text-gray-900' : 'bg-gray-800 text-yellow-400'}`}>
                <FontAwesomeIcon icon={isDarkMode ? faSun : faMoon} />
            </button>
        </div>
    );
};

export default ChatHeader;
