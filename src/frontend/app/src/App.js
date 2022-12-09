import logo from './logo.svg';
import './App.css';
import { HashRouter, Routes, Route } from "react-router-dom";
import Feed from './Pages/Feed';
import User from './Pages/User';
import TopNavbar from './Components/navbar';
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  return (
    <div>
      <HashRouter>
        <Routes>
          <Route path="/" element={<Feed />} />
          <Route path="/user" element={<User />} />
        </Routes>
      </HashRouter>
    </div>
  );
}

export default App;
