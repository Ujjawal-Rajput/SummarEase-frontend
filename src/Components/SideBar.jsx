import { MessageSquare, Plus, Bot, Medal, Zap } from 'lucide-react';
import { useRecoilValue } from 'recoil';
import { sidebarAtom } from '../Store/State';

function SideBar() {
    const isSidebarOpen = useRecoilValue(sidebarAtom);
    const chapters = [
        { id: 1, title: 'Getting Started' },
        { id: 2, title: 'Basic Concepts' },
        { id: 3, title: 'Advanced Topics' },
        { id: 4, title: 'Best Practices' },
        { id: 5, title: 'Examples & Use Cases' },
      ];
    return (
        <div className={`sidebar ${isSidebarOpen ? 'open' : ''}`}>
            <div className="new-chat-container">
                <button className="new-chat-button">
                    <Plus size={16} />
                    <span>New Chat</span>
                </button>
            
                <button className="new-chat-button">
                    <Bot size={16} />
                    <span>Ask Me Anything</span>
                </button>
                <button className="new-chat-button">
                    <Medal size={16} />
                    <span>Document summarizer</span>
                </button>
                <button className="new-chat-button">
                    <Zap size={16} />
                    <span>Generate flashcards</span>
                </button>
            </div>

            <div className="chapters-container">
                <h3 style={{color:'#fff', marginLeft:'20PX'}}>Chats</h3>
                {chapters.map((chapter) => (
                    <button key={chapter.id} className="chapter-button">
                        <MessageSquare size={16} />
                        <span>{chapter.title}</span>
                    </button>
                ))}
            </div>
        </div>
    )
}

export default SideBar
