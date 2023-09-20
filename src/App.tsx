import './App.css';
import { Content } from './app/components/Content';
import { Menu } from './app/components/Menu';
import { BrowserRouter } from 'react-router-dom';

const App = () => {

  return (
    <BrowserRouter>
      {/* <Menu /> */}
      <Content />
    </BrowserRouter>
  );

}
export default App;