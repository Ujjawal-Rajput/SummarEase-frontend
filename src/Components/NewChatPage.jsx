import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSetRecoilState } from 'recoil';
import { chaptersAtom, messageResponseAtom, currentSessionAtom, responseTopic, messagesHistoryAtom } from '../Store/State';
import { useLogout } from '../Utils/LogoutHandler';

const NewChatPage = () => {
    const navigate = useNavigate();
    const setMessages = useSetRecoilState(messageResponseAtom);
    const setChapters = useSetRecoilState(chaptersAtom);
    const setCurrentSession = useSetRecoilState(currentSessionAtom);
    const setResponseTopic = useSetRecoilState(responseTopic);
    const apiCalled = useRef(false); // To track if API call has been made
    const handleLogout = useLogout();
    const setMessagesHistory = useSetRecoilState(messagesHistoryAtom);

    useEffect(() => {
        const handleNewChat = async () => {
            if (apiCalled.current) return; // Prevent duplicate calls
            apiCalled.current = true;
            setMessages([]); // Clear the previous messages
            setMessagesHistory([]); // Clear messages history
            const token = JSON.parse(localStorage.getItem('auth'))?.token;
            // console.log(token);

            if (!token) {
                throw new Error('Unauthorized');
            }

            try {
                const response = await fetch(`${import.meta.env.VITE_API_URL}/api/create-session`, { 
                    method: 'POST',
                    headers: {
                        'Authorization': token,
                    },
                });
                const data = await response.json();

                // Handle (401) Response
                if (response.status === 401) {
                    console.log(data)
                    handleLogout(); // Logout the user
                    return;
                }

                // if (data.message === "Token has expired or invalid token") handleLogout();
                // console.log(data)

                // Set current session and chapters
                setCurrentSession(data.newSession);
                setChapters(data.allSessions);
                setResponseTopic('Ask-ai');

                // Navigate to the new session page
                navigate(`/c/${data.newSession.sessionId}`);
            } catch (error) {
                console.log(error);
            }
        };

        handleNewChat();
    }, []); 

    return <div>Loading new chat...</div>; 
};

export default NewChatPage;
