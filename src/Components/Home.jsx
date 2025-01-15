import SideBar from './SideBar';
import MainSection from './MainSection';
import '../App.css';

function Home() {
  return (
    <div className="app-container">
        <SideBar/>
        <MainSection/>   
    </div>
  );
}

export default Home;