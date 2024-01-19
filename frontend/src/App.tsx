import React from 'react';

import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

import LoginPage from './pages/Login';
import SetUsernamePage from './pages/SetUserName';
import ChatPage from './pages/ChatPage';
import usersStore from './store/users.store';

const App = () => {
  const user = usersStore.users.value;

  if (user === null) {
    return (
      <BrowserRouter>
        <Routes>
          <Route
            path='login'
            element={<LoginPage />}
          />
          <Route
            path='*'
            element={<Navigate to='login' />}
          />
        </Routes>
      </BrowserRouter>
    );
  }

  if (user.username === null) {
    return (
      <BrowserRouter>
        <Routes>
          <Route
            path='set-username'
            element={<SetUsernamePage />}
          />
          <Route
            path='*'
            element={<Navigate to='set-username' />}
          />
        </Routes>
      </BrowserRouter>
    );
  }
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path='chat'
          element={<ChatPage />}
        />
        <Route
          path='*'
          element={<Navigate to='chat' />}
        />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
