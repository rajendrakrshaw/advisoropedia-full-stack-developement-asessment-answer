// App.js
import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginSignupForm from './components/LoginSignupForm';
import PostsList from './components/PostsList';

const App = () => {
  const [isLoggedIn, setLoggedIn] = useState(false);
  const [token, setToken] = useState(null); // New

  const handleLogin = (t) => {
    console.log(t);
    // Simulate authentication logic
    setLoggedIn(true);
    setToken(t);
  };

  return (
    <Router>
      <Routes>
       
        <Route
          path="/"
          element={<LoginSignupForm onLogin={handleLogin} />}
        />
         <Route
          path="/posts"
          element={isLoggedIn ? <PostsList token={token} /> : <Navigate to="/" />}
        />
      </Routes>
    </Router>
  );
};

export default App;
