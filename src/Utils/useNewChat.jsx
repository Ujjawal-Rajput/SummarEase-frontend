import { useSetRecoilState } from 'recoil';
import { chaptersAtom, messageResponseAtom, currentSessionAtom, responseTopic } from '../Store/State';
import { useLogout } from '../Utils/LogoutHandler';
import { useNavigate } from 'react-router-dom';

const useNewChat = () => {
  const setMessages = useSetRecoilState(messageResponseAtom);
  const setChapters = useSetRecoilState(chaptersAtom);
  const setCurrentSession = useSetRecoilState(currentSessionAtom);
  const setResponseTopicValue = useSetRecoilState(responseTopic);
  const navigate = useNavigate();
  const handleLogout = useLogout();

  const handleNewChat = async () => {
    setMessages([]);
    //make request to srever for new session and get all sessions also and set them into current session atom

    const token = JSON.parse(localStorage.getItem('auth'))?.token; //{user: {email: "a@a.a", name: "a"}, token: "jwt-token"}

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
      // console.log(data)
      
      if (data.message === "Token has expired or invalid token") handleLogout();

      setCurrentSession(data.newSession);
      setChapters(data.allSessions);
      setResponseTopicValue('Ask-ai');
      navigate(`/c/${data.newSession.sessionId}`);
    } catch (error) {
      console.log(error);
    }
  };

  return { handleNewChat };
};

export default useNewChat;
