import logo from './logo.svg';
import './App.css';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Feed from './Pages/Feed';
import User from './Pages/User';
import TopNavbar from './Components/navbar';
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  return (
    <div>
      <TopNavbar></TopNavbar>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Feed />} />
          <Route path="/user" element={<User />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
