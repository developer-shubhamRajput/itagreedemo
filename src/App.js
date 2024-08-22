import logo from './logo.svg';
import './App.css';
import LandingPage from "./pages/LandingPage/index"
import Agreements from './pages/Agreements';

function App() {
  return (
    <div className='flex flex-col gap-6'>
      <LandingPage/>
      <Agreements/>
    </div>
  );
}

export default App;
