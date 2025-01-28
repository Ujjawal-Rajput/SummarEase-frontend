import { Plus, Bot, Medal, Zap, LogOut, ArrowBigRightIcon, Code } from 'lucide-react';
import { useRecoilState, useRecoilValue } from 'recoil';
import { sidebarAtom,  authState, responseTopic } from '../Store/State';
import SidebarSessions from './SidebarSessions';
import { useLogout } from '../Utils/LogoutHandler';
import useNewChat from '../Utils/useNewChat'; 

function SideBar() {
  const isSidebarOpen = useRecoilValue(sidebarAtom);
  const authUser = useRecoilValue(authState);
  const [responseTopicValue, setResponseTopicValue] = useRecoilState(responseTopic);
  const handleLogout = useLogout();
  const { handleNewChat } = useNewChat();

  const features = [
    { id: 'Ask-ai', label: 'Ask AI', icon: <Bot size={16} /> },
    { id: 'Code', label: 'Ask to code', icon: <Code size={16} /> },
    { id: 'Summarize', label: 'Summarizer', icon: <Medal size={16} /> },
    { id: 'Flashcard', label: 'Flashcard', icon: <Zap size={16} /> },
    { id: 'Quiz', label: 'Quiz', icon: <ArrowBigRightIcon size={16} /> },
  ];

  return (
    <div className={`sidebar ${isSidebarOpen ? 'open' : ''}`}>
      <div className="new-chat-container">
        <button className="new-chat-button" onClick={handleNewChat}>
          <Plus size={16} />
          <span>New Chat</span>
        </button>

        <h3 style={{ color: '#fff', marginBottom: '10px' }}>Features</h3>

        {features.map((feature) => (
          <button
            className="new-chat-button"
            onClick={() => setResponseTopicValue(feature.id)}
            key={feature.id}
            style={responseTopicValue === feature.id ? { backgroundColor: 'transparent' } : {}}
          >
            {feature.icon}
            <span>{feature.label}</span>
          </button>
        ))}
      </div>

      <h3 style={{ color: '#fff', marginLeft: '20PX' }}>Chats</h3>
      <div className="chapters-container" style={{ color: '#fff' }}>
        <SidebarSessions />
      </div>

      <div className="new-chat-container">
        <button className="new-chat-button" onClick={handleLogout}>
          <LogOut size={16} />
          <span>Logout ({authUser.user.name})</span>
        </button>
      </div>
    </div>
  );
}

export default SideBar;