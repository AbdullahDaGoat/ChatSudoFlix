import React, { useState, useEffect, useRef } from 'react';
import io from 'socket.io-client';
import ChatHeader from './ChatHeader';
import MessageList from './MessageList';
import ImagePreview from './ImagePreview';
import MessageInput from './MessageInput';
import styles from './Chat.module.css';

const Chat: React.FC<{ isDarkMode: boolean; toggleTheme: () => void; }> = ({ isDarkMode, toggleTheme }) => {
    const [messages, setMessages] = useState<any[]>([]);
    const [inputMessage, setInputMessage] = useState('');
    const [socket, setSocket] = useState<any>(null);
    const [uploadedImages, setUploadedImages] = useState<File[]>([]);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const newSocket = io('http://localhost:3001');
        setSocket(newSocket);

        newSocket.on('connect', () => {
            newSocket.emit('join', { room: 'main' });
        });

        newSocket.on('message', (message: any) => {
            setMessages(prevMessages => [...prevMessages, message]);
        });

        newSocket.on('recentMessages', (messages: any[]) => {
            setMessages(messages);
        });

        return () => {
            newSocket.disconnect();
        };
    }, []);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const sendMessage = async () => {
        if (socket) {
            for (const image of uploadedImages) {
                const reader = new FileReader();
                reader.onload = (e) => {
                    if (e.target && e.target.result) {
                        socket.emit('upload', {
                            filename: image.name,
                            buffer: e.target.result
                        });
                    }
                };
                reader.readAsDataURL(image);
            }

            setUploadedImages([]);
            if (inputMessage.trim()) {
                socket.emit('message', inputMessage);
                setInputMessage('');
            }
        }
    };

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const filesArray = Array.from(e.target.files);
            setUploadedImages(prev => [...prev, ...filesArray]);
        }
    };

    const cancelUpload = (index: number) => {
        setUploadedImages(prev => prev.filter((_, i) => i !== index));
    };

    return (
        <div className={`flex flex-col h-screen ${isDarkMode ? 'dark bg-gray-900' : 'bg-peach-50'}`}>
            <div className="flex-grow flex flex-col p-6"> {/* Increased padding */}
                <ChatHeader isDarkMode={isDarkMode} toggleTheme={toggleTheme} />
                <div className={styles.messageContainer}>
                    <MessageList messages={messages} isDarkMode={isDarkMode} />
                    <div ref={messagesEndRef} />
                </div>
                <div className={styles.imagePreviewContainer}>
                    <ImagePreview uploadedImages={uploadedImages} cancelUpload={cancelUpload} />
                </div>
                <MessageInput
                    inputMessage={inputMessage}
                    setInputMessage={setInputMessage}
                    sendMessage={sendMessage}
                    handleFileSelect={handleFileSelect}
                    uploadedImages={uploadedImages}
                    isDarkMode={isDarkMode}
                />
            </div>
        </div>
    );
};

export default Chat;
