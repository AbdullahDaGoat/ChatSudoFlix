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
                        ) : message.type === 'audio' ? (
                            <audio controls className="mt-1">
                                <source src={`http://localhost:3001/uploads/${message.content}`} type="audio/*"  />
                                Your browser does not support the audio tag.
                            </audio>
                        ) : message.type === 'video' ? (
                            <video controls className="mt-1 max-w-xs">
                                <source src={`http://localhost:3001/uploads/${message.content}`} type="video/*" />
                                Your browser does not support the video tag.
                            </video>
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