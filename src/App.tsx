import './App.css';
import { Content } from './app/components/Content';
import { Menu } from './app/components/Menu';
import { BrowserRouter } from 'react-router-dom';
import NavBar from './app/components/NavBar';

const App = () => {

  return (
    <BrowserRouter>
      {/* <Menu /> */}
      <NavBar />
      <Content />
    </BrowserRouter>
  );

}
export default App;