import React, { useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';
import { currentSessionAtom, messageResponseAtom, responseTopic } from '../Store/State';
import AiResponse from './AiResponse';
import Quiz from './Quiz';
import FlashCard from './FlashCard';
import { useLogout } from '../Utils/LogoutHandler';
import SessionNotFoundError from './SessionNotFoundError';
import { User, Bot } from 'lucide-react';


function GetSessionMessages() {
    const { session_id } = useParams(); // Get session_id from URL
    // console.log(session_id)
    const [messages, setMessages] = useRecoilState(messageResponseAtom);
    const messagesEndRef = useRef(null);
    const [error, setError] = useState(null);
    const setCurrentSessionId = useSetRecoilState(currentSessionAtom);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const handleLogout = useLogout();
    // const responseTopicValue = useRecoilValue(responseTopic);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    useEffect(() => {
        const fetchMessages = async () => {
            try {
                setLoading(true);
                const token = JSON.parse(localStorage.getItem('auth')).token; // Assuming the token is stored in localStorage
                const response = await fetch(`${import.meta.env.VITE_API_URL}/c/${session_id}`, {
                    method: 'POST',
                    headers: {
                        Authorization: token,
                        'Content-Type': 'application/json',
                    },
                });

                if (response.ok) {
                    const data = await response.json();
                    // console.log(data)
                    if (data.error === "Session has expired") handleLogout();
                    
                    setMessages(data.message || []); // Assuming messages are in the 'messages' field
                    // console.log(data.message)
                    setCurrentSessionId({
                        sessionId: data.sessionId,
                        title: data.title
                    })
                    setError(null);
                } else {
                    const errorData = await response.json();
                    // if (errorData.error === 'Session has expired') handleLogout();
                    console.error('Error fetching messages:', errorData.error);
                    setError(errorData.error);  // Set the error message
                    setCurrentSessionId({
                        sessionId: null,
                        title: null
                    });
                }
            } catch (error) {
                console.error('Error fetching messages:', error);
                setError('An error occurred while fetching session data');
                setCurrentSessionId({
                    sessionId: null,
                    title: null
                });
            } finally {
                setLoading(false); // Set loading to false after fetching
            }
        };

        if (session_id) {
            fetchMessages(); // Fetch messages when session_id changes
        }
    }, [session_id, setMessages]);


    if (loading) {
        return (
            <div className="loading-state">
                <h3>Loading conversations...</h3>
            </div>
        );
    }


    if (error) {
        return <SessionNotFoundError message={error}/>  // Render the error page
    }

    else {
        return (
            <>
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
                                    <div className='user-message-icon'>
                                        <User/>
                                    </div>
                                    <div className="message">
                                        {message.files.length > 0 && <div className='document-present'>.{message.files[0].split('.')[1]} document present </div>}
                                        {message.message}

                                    </div>
                                </div>
                                <div className="message-wrapper assistant-message">
                                    <div className='assistant-message-icon'>
                                        <Bot/>
                                    </div>
                                    <div className="message">
                                        {message.topic === 'Quiz' && <Quiz response={message.response} topic={message.topic} /> }
                                        {message.topic === 'Flashcard' && <FlashCard response={message.response} topic={message.topic} /> }
                                        {(message.topic === 'Ask-ai' || message.topic === 'Summarize' || message.topic === 'Code') && <AiResponse response={message.response} /> }
                                        
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )
                }

                <div ref={messagesEndRef} />

            </>
        )
    }
}

export default GetSessionMessages
