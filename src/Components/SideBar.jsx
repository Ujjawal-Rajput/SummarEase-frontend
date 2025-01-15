import { MessageSquare, Plus, Bot, Medal, Zap, LogOut } from 'lucide-react';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import { authState, chaptersAtom, messageResponseAtom, sidebarAtom, currentSessionAtom } from '../Store/State';
import { useNavigate } from 'react-router-dom';
import SidebarSessions from './SidebarSessions';
import { useLogout } from './LogoutHandler';

function SideBar() {
    const isSidebarOpen = useRecoilValue(sidebarAtom);
    // const chapters = useRecoilValue(chaptersAtom);
    const setAuth = useSetRecoilState(authState);
    const setMessages = useSetRecoilState(messageResponseAtom);
    const setChapters = useSetRecoilState(chaptersAtom);
    const setCurrentSession = useSetRecoilState(currentSessionAtom);
    const navigate = useNavigate();
    const handleLogout = useLogout();

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
        console.log(token)
        if (!token) {
            throw new Error('Unauthorized');
        }
        try{
            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/create-session`,{
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
            navigate(`/c/${data.newSession.sessionId}`);
        } catch(error){
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
            
                <button className="new-chat-button">
                    <Bot size={16} />
                    <span>Ask Ai</span>
                </button>
                <button className="new-chat-button">
                    <Medal size={16} />
                    <span>Chapter summarizer</span>
                </button>
                <button className="new-chat-button">
                    <Zap size={16} />
                    <span>Generate flashcards</span>
                </button>
                <button className="new-chat-button">
                    <Zap size={16} />
                    <span>Quiz generator</span>
                </button>
            </div>

                <h3 style={{color:'#fff', marginLeft:'20PX'}}>Chats</h3>
            <div className="chapters-container" style={{color:'#fff'}}>
                <SidebarSessions/>
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
                    <span>Logout</span>
                </button>
            </div>
        </div>
    )
}

export default SideBar
