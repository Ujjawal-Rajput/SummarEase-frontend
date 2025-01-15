import React from 'react'
import { Menu } from 'lucide-react';
import { useSetRecoilState } from 'recoil';
import { sidebarAtom } from '../Store/State';
import Input from './Input';
import GetSessionMessages from './GetSessionMessages';
// import DragAndDropUpload from './DragAndDropUpload';
// import FlashCard from './FlashCard';
//remove drag and drop function

function MainSection() {
    const setIsSidebarOpen = useSetRecoilState(sidebarAtom);
      
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
            <div>

            </div>
            <div className="messages-area">
                <GetSessionMessages/>
            </div>

            <Input />
                
        </div>
    )
}

export default MainSection
