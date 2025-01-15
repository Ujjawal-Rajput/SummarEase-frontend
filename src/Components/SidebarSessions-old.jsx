// Sidebar.js
import React, { useEffect } from 'react';
import { useRecoilValueLoadable, useSetRecoilState, useRecoilState } from 'recoil';
import { chaptersAtom, fetchUserSessions } from '../Store/State';
import { MessageSquare } from 'lucide-react';
import { useLocation } from 'react-router-dom';


const SidebarSessions = () => {
    const { state, contents, error } = useRecoilValueLoadable(fetchUserSessions);
    const [chapters, setChapters] = useRecoilState(chaptersAtom);
    const location = useLocation();

    // Extract active session ID from the URL
    const activeSessionId = location.pathname.split('/').pop();

    useEffect(() => {
        if (state === 'hasValue') {
            setChapters((chapters) => chapters = contents);
            // console.log(contents)
            // Data has been successfully fetched
            // Optionally, you can also update the atom manually here if needed
            // setSessions(contents); // (if you are using `useRecoilState` instead of `useRecoilStateLoadable`)
        }
    }, [state, contents]);

    if (state === 'loading') {
        return <div>Loading sessions...</div>;
    }

    if (state === 'hasError') {
        return <div>Error fetching sessions: {error.message}</div>;
    }

    return (
        <div>
            <ul>
                {chapters && chapters.length > 0 ? (
                    chapters
                        .slice() // Create a copy of the array to avoid mutating the original
                        .reverse().map((session) => (
                            <li key={session.sessionId}>
                            <a href={activeSessionId === session.sessionId.toString() ? '#' : `/c/${session.sessionId}`} 
                                style={{
                                    borderColor:
                                        activeSessionId === session.sessionId.toString() ? '#red' : 'orange'
                                }}
                            >
                                <button className="chapter-button">
                                    <MessageSquare size={16} />
                                    <span>{session.title}</span>
                                </button></a>
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
