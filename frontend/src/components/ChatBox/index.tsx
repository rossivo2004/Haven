'use client';

import React, { useState } from 'react';
import ChatIcon from '@mui/icons-material/Chat';
import CloseIcon from '@mui/icons-material/Close';
import SendIcon from '@mui/icons-material/Send';
import {Input} from "@nextui-org/react";
import './style.scss';
import apiConfig from '@/src/config/api';

function ChatBox() {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<{ user: string; admin: string }[]>([]);
    const [inputValue, setInputValue] = useState('');
    const [loading, setLoading] = useState(false); // New loading state

    const toggleChat = () => {
        setIsOpen(!isOpen);
    };

    const sendMessage = async () => {
        if (!inputValue) return;

        // Check if the last message is the same as the current input
        if (messages.length > 0 && messages[messages.length - 1].user === inputValue) {
            return; // Prevent duplicate messages
        }

        // Add user message to chat
        setMessages([...messages, { user: inputValue, admin: '' }]);
        setLoading(true); // Set loading to true

        // Call the API
        const response = await fetch(apiConfig.chatbot.getChatbot, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ question: inputValue }),
        });

        const data = await response.json();

        // Add admin response to chat without repeating user question
        setMessages(prevMessages => [...prevMessages, { user: '', admin: data.answer }]);
        setInputValue(''); // Clear input
        setLoading(false); // Set loading to false
    };

    const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            sendMessage(); // Send message on Enter key press
        }
    };

    return (
        <div className="fixed lg:bottom-[110px] lg:right-10 bottom-[145px] right-6 z-50">
            {!isOpen && (
                <button
                    onClick={toggleChat}
                    className="w-14 h-14 rounded-full dark:bg-main bg-black text-white hover:bg-gray-700 transition-all duration-300"
                >
                    <ChatIcon />
                </button>
            )}

            {isOpen && (
                <div className="chat-box bg-white shadow-lg rounded-lg p-4 mt-2 w-80">
                    <div className='flex-1'>
                        <div className="flex justify-between items-center mb-2">
                            <h2 className="font-semibold">Chat</h2>
                            <button onClick={toggleChat}>
                                <CloseIcon />
                            </button>
                        </div>
                        <div className="h-[300px] overflow-y-auto flex flex-col">
                            {messages.length === 0 && <div className="text-center"><img className='pt-20' src="/images/chatbot.png" alt="chatbot" /></div>}
                            {messages.map((msg, index) => (
                                <div key={index} className="mb-2 flex flex-col">
                                    {msg.user && <div className="user ">{msg.user}</div>}
                                    {msg.admin && <div className="admin"><strong>Haven BOT:</strong> {msg.admin}</div>}
                                </div>
                            ))}
                            {loading && <div className="loading-dot"></div>}
                        </div>
                    </div>
                    <Input
                        type="text"
                        placeholder="Nhập câu hỏi..."
                        className="w-full p-2"
                        // color='warning'
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        onKeyPress={handleKeyPress}
                        endContent={<SendIcon className='cursor-pointer' onClick={sendMessage} />}
                    />
                </div>
            )}
        </div>
    );
}

export default ChatBox;
