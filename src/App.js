import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './Home';
import LoginPage from './LoginPage';

import SignUp from './SignUp';
import ChattingList from './ChattingList';
import ChatComponent from './ChatComponent';

function App() {
  return (
    <Router>
      <Routes>
        <Route exact path="/" element={<Home />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/chatlist" element={<ChattingList />} />
        <Route path="/chat" element={<ChatComponent />} />
      </Routes>
    </Router>
  );
}

export default App;
