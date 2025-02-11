// Sidebar.js
import React, { useEffect } from 'react';
import {  useSetRecoilState, useRecoilState } from 'recoil';
import { chaptersAtom, messagesHistoryAtom } from '../Store/State';
import { MessageSquare } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useLogout } from '../Utils/LogoutHandler';


const SidebarSessions = () => {
    // const { state, contents, error } = useRecoilValueLoadable(fetchUserSessions);
    const [chapters, setChapters] = useRecoilState(chaptersAtom);
    const location = useLocation();
    const navigate = useNavigate();
    const handleLogout = useLogout();
    const setMessagesHistory = useSetRecoilState(messagesHistoryAtom);

    // const handleNewChat = () => {
    //     const sessionId = generateSessionId(); 
    //     navigate(`/c/${sessionId}`);
    //   };

    // Extract active session ID from the URL
    const activeSessionId = location.pathname.split('/').pop();

    useEffect(() => {
        const fetchSessions = async () => {
            try {
                const token = JSON.parse(localStorage.getItem('auth')).token; //{user: {email: "a@a.a", name: "a"}, token: "jwt-token"}
                // console.log(token)
                if (!token) {
                    throw new Error('Unauthorized');
                }
                const response = await fetch(`${import.meta.env.VITE_API_URL}/api/get-sessions`, {
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


                // if (data.message == "Token has expired or invalid token") handleLogout();
                // console.log(data)
                setChapters(data.sessions);

            } catch (error) {
                console.error(error);
            }
        }

        fetchSessions();
    },[]);

    return (
        <div>
            <ul>
                {chapters && chapters.length > 0 ? (
                    chapters
                        .slice() // Create a copy of the array to avoid mutating the original
                        .reverse().map((session) => (
                            <li key={session.sessionId} >
                                {/* <a href={activeSessionId === session.sessionId.toString() ? '#' : `/c/${session.sessionId}`}
                                    
                                > */}
                                    <button disabled={session.sessionId === activeSessionId} className={session.sessionId === activeSessionId ? 'chapter-button active-chapter' : 'chapter-button'} onClick={()=>{
                                        setMessagesHistory([]);
                                        console.log("history reset")
                                        navigate(`/c/${session.sessionId}`)
                                    }}>
                                        <MessageSquare size={16} />
                                        <span>{session.title && session.title.length > 20 ? session.title.slice(0, 20) + "..." : session.title }</span>
                                    </button>
                            </li>
                            // <li key={session.sessionId} className='chapter-button'>
                            //     <a href={`/c/${session.sessionId}`}>
                            //         {session.title}
                            //     </a>
                            // </li>
                        ))
                ) : (
                    <li>No sessions available</li>
                )}
            </ul>
        </div>
    );
};

export default SidebarSessions;
