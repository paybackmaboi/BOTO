import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// Core Pages & Components
import HomePage from './pages/HomePage';
import AdminDashboard from './Admin/AdminDashboard';
import UserDashboard from './User/UserDashboard'; // <-- VERIFY THIS LINE

// Styles
import 'bootstrap/dist/css/bootstrap.min.css';
import './index.css';
import './App.css';

function App() {
  const [isAdminLoggedIn, setAdminLoggedIn] = useState(() => !!localStorage.getItem('isAdminLoggedIn'));
  const [isUserLoggedIn, setUserLoggedIn] = useState(() => !!localStorage.getItem('isUserLoggedIn'));

  const handleAdminLogin = (status: boolean) => {
    setAdminLoggedIn(status);
    if (status) {
      localStorage.setItem('isAdminLoggedIn', 'true');
    } else {
      localStorage.removeItem('isAdminLoggedIn');
    }
  };

  const handleUserLogin = (status: boolean) => {
    setUserLoggedIn(status);
    if (status) {
      localStorage.setItem('isUserLoggedIn', 'true');
    } else {
      localStorage.removeItem('isUserLoggedIn');
      localStorage.removeItem('current-voter-session');
    }
  };


  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage setAdminLoggedIn={handleAdminLogin} setUserLoggedIn={handleUserLogin} />} />

        {/* Admin Routes */}
        <Route
          path="/admin/*"
          element={isAdminLoggedIn ? <AdminDashboard setAdminLoggedIn={handleAdminLogin}/> : <Navigate to="/" replace />}
        />

        {/* User Routes */}
        <Route
          path="/user/*"
          element={isUserLoggedIn ? <UserDashboard setUserLoggedIn={handleUserLogin} /> : <Navigate to="/" replace />}
        />
      </Routes>
    </Router>
  );
}

export default App;