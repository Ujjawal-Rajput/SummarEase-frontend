import SideBar from './Components/SideBar';
import MainSection from './Components/MainSection';
import Input from './Components/Input';
import { RecoilRoot } from 'recoil';
import './App.css';

function App() {
  return (
    <div className="app-container">
      <RecoilRoot>
        <SideBar/>
        <MainSection/>
      </RecoilRoot>
    </div>
  );
}

export default App;