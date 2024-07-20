import React from 'react';

interface MessageListProps {
    messages: any[];
    isDarkMode: boolean;
}

const MessageList: React.FC<MessageListProps> = ({ messages, isDarkMode }) => {
    return (
        <div className={`flex-grow overflow-y-auto p-4 rounded-lg shadow-md mb-4 ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
            {messages.map((message, index) => (
                <div key={index} className={`mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-800'}`}>
                    <span className={`font-bold ${isDarkMode ? 'text-peach-400' : 'text-peach-600'}`}>{message.user_id.slice(0, 6)}: </span>
                    {message.type === 'text' ? 
                        message.content : 
                        message.type === 'image' ? (
                            <img src={`http://localhost:3001/uploads/${message.content}`} alt="Uploaded" className="max-w-xs max-h-48 mt-1 cursor-pointer rounded-md" />
                        ) : (
                            <span className={`text-sm ${isDarkMode ? 'text-gray-500' : 'text-gray-600'}`}>{message.content}</span>
                        )
                    }
                </div>
            ))}
        </div>
    );
};

export default MessageList;