import { useSetRecoilState } from 'recoil';
import { useNavigate } from 'react-router-dom';
import { authState, messageResponseAtom, chaptersAtom, currentSessionAtom, responseTopic } from '../Store/State';

export const useLogout = () => {
  const setAuth = useSetRecoilState(authState);
  const setMessages = useSetRecoilState(messageResponseAtom);
  const setChapters = useSetRecoilState(chaptersAtom);
  const setCurrentSession = useSetRecoilState(currentSessionAtom);
  const setSelectedOption = useSetRecoilState(responseTopic);
  const navigate = useNavigate();
  

  const handleLogout = () => {
    setAuth({
      user: null,
      token: null,
    });
    setMessages([]);
    setChapters([]);
    setCurrentSession({
      sessionId: null,
      title: null,
    });
    setSelectedOption('Ask-ai');
    localStorage.removeItem('auth');
    navigate('/login');
  };

  return handleLogout;
};
