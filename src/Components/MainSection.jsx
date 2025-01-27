import React from 'react'
import { Menu, LogOut } from 'lucide-react';
import { useSetRecoilState } from 'recoil';
import { sidebarAtom } from '../Store/State';
import Input from './Input';
import GetSessionMessages from './GetSessionMessages';
import {useLogout} from '../Utils/LogoutHandler'; 
// import DragAndDropUpload from './DragAndDropUpload';
// import FlashCard from './FlashCard';
//remove drag and drop function

function MainSection() {
    const setIsSidebarOpen = useSetRecoilState(sidebarAtom);
    const { handleLogout } = useLogout();

    return (
        <div className="main-content">
            <header className="header">
                <div>

                    <button onClick={() => setIsSidebarOpen((isSidebarOpen) => !isSidebarOpen)} className="menu-button">
                        <Menu size={25} />
                    </button>

                    <h3>SummarEase Ai</h3>
                </div>

                <div>
                    <button onClick={handleLogout} className="logout-header-button">
                            <LogOut size={20} />
                    </button>
                </div>
            </header>

            {/* <FlashCard /> */}
            <div>

            </div>
            <div className="messages-area">
                <GetSessionMessages />
            </div>

            <Input />

        </div>
    )
}

export default MainSection
