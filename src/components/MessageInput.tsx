import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUpload, faPaperPlane } from '@fortawesome/free-solid-svg-icons';

interface MessageInputProps {
    inputMessage: string;
    setInputMessage: React.Dispatch<React.SetStateAction<string>>;
    sendMessage: () => Promise<void>;
    handleFileSelect: (e: React.ChangeEvent<HTMLInputElement>) => void;
    uploadedImages: File[];
    isDarkMode: boolean;
}

const MessageInput: React.FC<MessageInputProps> = ({
    inputMessage,
    setInputMessage,
    sendMessage,
    handleFileSelect,
    uploadedImages,
    isDarkMode
}) => {

    return (
        <div className="flex space-x-2">
            <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                        e.preventDefault();
                        sendMessage();
                    }
                }}
                className={`flex-grow px-4 py-2 rounded-md focus:outline-none ${isDarkMode ? 'bg-gray-800 text-white' : 'bg-white text-black'}`}
                placeholder="Type your message..."
            />
            <label htmlFor="fileInput" className="p-2 rounded-md cursor-pointer transition-colors duration-200 bg-peach-500 hover:bg-peach-600 text-white">
                <FontAwesomeIcon icon={faUpload} />
                <input id="fileInput" type="file" accept="image/*" multiple className="hidden" onChange={handleFileSelect} />
            </label>
            <button onClick={sendMessage} className="p-2 rounded-md bg-blue-500 hover:bg-blue-600 text-white">
                <FontAwesomeIcon icon={faPaperPlane} />
            </button>
        </div> 
    );
};

export default MessageInput;



