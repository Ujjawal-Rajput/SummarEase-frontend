import { MessageSquare, Plus, Bot, Medal, Zap, LogOut, ArrowBigRightIcon, Code } from 'lucide-react';
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';
import { chaptersAtom, messageResponseAtom, sidebarAtom, currentSessionAtom, responseTopic, authState } from '../Store/State';
import { useNavigate } from 'react-router-dom';
import SidebarSessions from './SidebarSessions';
import { useLogout } from '../Utils/LogoutHandler';

function SideBar() {
    const isSidebarOpen = useRecoilValue(sidebarAtom);
    // const chapters = useRecoilValue(chaptersAtom);
    const authUser = useRecoilValue(authState);
    const setMessages = useSetRecoilState(messageResponseAtom);
    const setChapters = useSetRecoilState(chaptersAtom);
    const setCurrentSession = useSetRecoilState(currentSessionAtom);
    const [responseTopicValue, setResponseTopicValue] = useRecoilState(responseTopic);
    const navigate = useNavigate();
    const handleLogout = useLogout();

    const features = [
        { id: 'Ask-ai', label: 'Ask AI',icon:<Bot size={16} /> },
        { id: 'Code', label: 'Ask to code',icon:<Code size={16} /> },
        { id: 'Summarize', label: 'Summarizer', icon:<Medal size={16} /> },
        { id: 'Flashcard', label: 'Flashcard', icon:<Zap size={16} />},
        { id: 'Quiz', label: 'Quiz', icon:<ArrowBigRightIcon size={16} /> },
    ];


    // const handleLogout = () => {
    //     setAuth({
    //         user: null,
    //         token: null
    //     });
    //     setMessages([]);
    //     setChapters([]);
    //     setCurrentSession({
    //         sessionId : null,
    //         title : null
    //     });
    //     localStorage.removeItem('auth');
    //     navigate('/login');
    //   };



    const handleNewChat = async () => {
        setMessages([]);
        //make request to srever for new session and get all sessions also and set them into current session atom

        const token = JSON.parse(localStorage.getItem('auth')).token; //{user: {email: "a@a.a", name: "a"}, token: "jwt-token"}
        // console.log(token)
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


            if (!response.ok) {
                throw new Error('Failed to fetch sessions');
            }

            const data = await response.json();
            if (data.message == "Token has expired or invalid token") handleLogout();
            // console.log(data)
            setCurrentSession(data.newSession);
            setChapters(data.allSessions)
            setResponseTopicValue('Ask-ai');

            navigate(`/c/${data.newSession.sessionId}`);
        } catch (error) {
            console.log(error)
        }
    }

    return (
        <div className={`sidebar ${isSidebarOpen ? 'open' : ''}`}>
            <div className="new-chat-container">
                <button className="new-chat-button" onClick={handleNewChat}>
                    <Plus size={16} />
                    <span>New Chat</span>
                </button>

                <h3 style={{ color: '#fff', marginBottom: '10px' }}>Features</h3>


                {features.map((feature) => (
                        <button className="new-chat-button" onClick={()=>setResponseTopicValue(feature.id)} key={feature.id} style={responseTopicValue === feature.id ? { backgroundColor: 'transparent' } : {}}>
                            {feature.icon}
                            <span>{feature.label}</span>
                        </button>
                ))}
            </div>

            <h3 style={{ color: '#fff', marginLeft: '20PX' }}>Chats</h3>
            <div className="chapters-container" style={{ color: '#fff' }}>
                <SidebarSessions />
                {/* {chapters.map((chapter) => (
                    <button key={chapter.id} className="chapter-button">
                        <MessageSquare size={16} />
                        <span>{chapter.title}</span>
                    </button>
                ))} */}
            </div>


            <div className='new-chat-container'>
                <button className="new-chat-button" onClick={handleLogout}>
                    <LogOut size={16} />
                    <span>Logout ({authUser.user.name})</span>
                </button>
            </div>
        </div>
    )
}

export default SideBar
