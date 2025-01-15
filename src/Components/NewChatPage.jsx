import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSetRecoilState } from 'recoil';
import { chaptersAtom, messageResponseAtom, currentSessionAtom } from '../Store/State';
import { useLogout } from './LogoutHandler';

const NewChatPage = () => {
    const navigate = useNavigate();
    const setMessages = useSetRecoilState(messageResponseAtom);
    const setChapters = useSetRecoilState(chaptersAtom);
    const setCurrentSession = useSetRecoilState(currentSessionAtom);
    const apiCalled = useRef(false); // To track if API call has been made
    const handleLogout = useLogout();

    useEffect(() => {
        const handleNewChat = async () => {
            if (apiCalled.current) return; // Prevent duplicate calls
            apiCalled.current = true;
            setMessages([]); // Clear the previous messages
            const token = JSON.parse(localStorage.getItem('auth'))?.token;
            console.log(token);

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
                console.log("printing...")

                if (!response.ok) {
                    throw new Error('Failed to fetch sessions');
                }

                const data = await response.json();
                if (data.message === "Token has expired or invalid token") handleLogout();

                // Set current session and chapters
                setCurrentSession(data.newSession);
                setChapters(data.allSessions);
                // Navigate to the new session page
                navigate(`/c/${data.newSession.sessionId}`);
            } catch (error) {
                console.log(error);
            }
        };

        // Trigger the function when the page loads
        handleNewChat();
    }, []); // Empty dependency array ensures it runs only once on component mount

    return <div>Loading new chat...</div>; // You can show a loading spinner or message here
};

export default NewChatPage;
