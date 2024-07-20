import React, { useState, useEffect, useRef, KeyboardEvent } from 'react';
import io from 'socket.io-client';

const Chat: React.FC = () => {
    const [messages, setMessages] = useState<any[]>([]);
    const [inputMessage, setInputMessage] = useState('');
    const [socket, setSocket] = useState<any>(null);
    const [uploadedImage, setUploadedImage] = useState<File | null>(null);
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

        newSocket.on('uploadSuccess', (msg: string) => {
            console.log(msg);
        });

        newSocket.on('uploadError', (msg: string) => {
            console.error(msg);
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
            if (uploadedImage) {
                const reader = new FileReader();
                reader.onload = (e) => {
                    if (e.target && e.target.result) {
                        socket.emit('upload', {
                            filename: uploadedImage.name,
                            buffer: e.target.result // Send as base64
                        });
                        setUploadedImage(null);
                    }
                };
                reader.readAsDataURL(uploadedImage); // Change to readAsDataURL
            } else if (inputMessage.trim()) {
                socket.emit('message', inputMessage);
                setInputMessage('');
            }
        }
    };

    const handleKeyPress = (e: KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            sendMessage();
        }
    };

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setUploadedImage(e.target.files[0]);
        }
    };

    const cancelUpload = () => {
        setUploadedImage(null);
    };

    return (
        <div className="flex flex-col h-screen bg-gray-200">
            <div className="flex-grow flex flex-col p-4">
                <div id="messages" className="flex-grow overflow-y-auto p-4 bg-white rounded-lg shadow-md mb-4">
                    {messages.map((message, index) => (
                        <div key={index} className="mb-2">
                            {message.type === 'text' && (
                                <>
                                    <span className="font-bold">{message.user_id.slice(0, 6)}:</span> {message.content}
                                </>
                            )}
                            {message.type === 'image' && (
                                <>
                                    <span className="font-bold">{message.user_id.slice(0, 6)}:</span>
                                    <img src={`http://localhost:3001/uploads/${message.content}`} alt="Uploaded" className="max-w-xs max-h-48 mt-1 cursor-pointer" />
                                </>
                            )}
                            {message.type === 'status' && (
                                <span className="text-gray-500 text-sm">{message.content}</span>
                            )}
                        </div>
                    ))}
                    <div ref={messagesEndRef} />
                </div>
                <div className="flex space-x-2">
                    {uploadedImage && (
                        <div className="mr-2 relative">
                            <img src={URL.createObjectURL(uploadedImage)} alt="Preview" className="max-h-16 rounded-md" />
                            <button onClick={cancelUpload} className="absolute top-0 right-0 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center">×</button>
                        </div>
                    )}
                    <input
                        type="text"
                        value={inputMessage}
                        onChange={(e) => setInputMessage(e.target.value)}
                        onKeyPress={handleKeyPress}
                        className="flex-grow p-2 border border-gray-300 rounded-md"
                        placeholder="Type your message..."
                    />
                    <label htmlFor="fileInput" className="bg-green-500 text-white p-2 rounded-md cursor-pointer">
                        Upload
                        <input id="fileInput" type="file" accept="image/*" className="hidden" onChange={handleFileSelect} />
                    </label>
                    <button onClick={sendMessage} className="bg-blue-500 text-white p-2 rounded-md">Send</button>
                </div>
            </div>
        </div>
    );
};

export default Chat;