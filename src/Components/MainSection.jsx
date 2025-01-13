import React, { useEffect, useRef } from 'react'
import { Menu } from 'lucide-react';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import { messageResponseAtom, sidebarAtom } from '../Store/State';
import FlashCard from './FlashCard';
import Input from './Input';
import DragAndDropUpload from './DragAndDropUpload';
import AiResponse from './AiResponse';
//remove drag and drop function

function MainSection() {
    const setIsSidebarOpen = useSetRecoilState(sidebarAtom);
    const messages = useRecoilValue(messageResponseAtom);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
      };
    
      useEffect(() => {
        scrollToBottom();
      }, [messages]);

    return (
        <div className="main-content">
            <header className="header">
                <button
                    onClick={() => setIsSidebarOpen((isSidebarOpen) => !isSidebarOpen)}
                    className="menu-button"
                >
                    <Menu size={20} />
                </button>
            </header>

            {/* <FlashCard /> */}
            <div className="messages-area">
                {messages.length === 0 ? (
                    <div className="empty-state">
                        <div className="empty-state-content">
                            {/* <DragAndDropUpload /> */}
                            <h1>How can I help you today?</h1>
                            <p>Ask me anything and I'll do my best to help!</p>
                        </div>
                    </div>
                ) : (
                    <div className="messages-container">
                        {messages.map((message, index) => (
                            <div key={index} >



                                <div className="message-wrapper user-message">
                                    <div className="message">
                                        {message.file.length > 0 && <div>document present </div>}
                                        {message.message}

                                    </div>
                                </div>
                                <div className="message-wrapper assistant-message">
                                    <div className="message">
                                        <AiResponse response={message.response} />

                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                <div ref={messagesEndRef} />
            </div>

            <Input />
        </div>
    )
}

export default MainSection
