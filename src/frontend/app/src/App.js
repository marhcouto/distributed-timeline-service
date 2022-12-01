import logo from './logo.svg';
import './App.css';
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Feed from './Pages/Feed';
import User from './Pages/User';

function App() {
  return (
    
    <BrowserRouter>
        <Routes>
          <Route path="/" element={<Feed />} />
          <Route path="/user" element={<User />} />
        </Routes>
      </BrowserRouter>

  );
}

export default App;
