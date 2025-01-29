import { useSetRecoilState } from 'recoil';
import { chaptersAtom, messageResponseAtom, currentSessionAtom, responseTopic, messagesHistoryAtom } from '../Store/State';
import { useLogout } from '../Utils/LogoutHandler';
import { useNavigate } from 'react-router-dom';

const useNewChat = () => {
  const setMessages = useSetRecoilState(messageResponseAtom);
  const setChapters = useSetRecoilState(chaptersAtom);
  const setCurrentSession = useSetRecoilState(currentSessionAtom);
  const setResponseTopicValue = useSetRecoilState(responseTopic);
  const navigate = useNavigate();
  const handleLogout = useLogout();
  const setMessagesHistory = useSetRecoilState(messagesHistoryAtom);

  const handleNewChat = async () => {
    setMessages([]);
    setMessagesHistory([]);
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
      const data = await response.json();

      // Handle (401) Response
      if (response.status === 401) {
        console.log(data)
        handleLogout(); // Logout the user
        return;
    }

      
      // if (data.message === "Token has expired or invalid token") handleLogout();
      // console.log(data)

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
