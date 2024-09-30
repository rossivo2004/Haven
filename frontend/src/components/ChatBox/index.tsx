'use client';

import React, { useState } from 'react';
import ChatIcon from '@mui/icons-material/Chat';
import CloseIcon from '@mui/icons-material/Close';
import SendIcon from '@mui/icons-material/Send';
import {Input} from "@nextui-org/react";
import './style.scss';

function ChatBox() {
    const [isOpen, setIsOpen] = useState(false);

    const toggleChat = () => {
        setIsOpen(!isOpen);
    };

    return (
        <div className="fixed lg:bottom-[110px] lg:right-10 bottom-[145px] right-6 z-50">
            {!isOpen && (
                <button
                    onClick={toggleChat}
                    className="w-14 h-14 rounded-full bg-black text-white hover:bg-gray-700 transition-all duration-300"
                >
                    <ChatIcon />
                </button>
            )}

            {isOpen && (
                <div className="chat-box bg-white shadow-lg rounded-lg p-4 mt-2 w-80">
                    <div>
                           <div className="flex justify-between items-center mb-2">
                        <h2 className="font-semibold">Chat</h2>
                        <button onClick={toggleChat}>
                            <CloseIcon />
                        </button>
                    </div>
                    <div className="h-48 overflow-y-auto flex flex-col">
                        <div className="mb-2 user">
                            How can I help you?
                        </div>
                        <div className="mb-2 admin">
                            <strong>Admin:</strong> Hello!
                        </div>
                        {/* Add more messages as needed */}
                    </div>
                    </div>
                 
                    <Input
                        type="text"
                        placeholder="Type a message..."
                        className="w-full p-2 border rounded"
                        endContent={<SendIcon className='cursor-pointer'/>}
                    />
                </div>
            )}
        </div>
    );
}

export default ChatBox;
