import { useState } from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import UserSidebar from '../components/UserSidebar';
import VotePage from './pages/VotePage';
import ResultPage from './pages/ResultPage';
import '../App.css';

interface UserDashboardProps {
    setUserLoggedIn: (isLoggedIn: boolean) => void;
}

const UserDashboard: React.FC<UserDashboardProps> = ({ setUserLoggedIn }) => {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();

  const toggleSidebar = () => {
    setSidebarOpen(!isSidebarOpen);
  };

  const handleLogout = () => {
    setUserLoggedIn(false);
    navigate('/', { replace: true });
  };

  return (
     <div className="App">
       <div className={`overlay ${isSidebarOpen ? 'show' : ''}`} onClick={toggleSidebar}></div>
       <UserSidebar />
       <div className="main-content">
          <Header toggleSidebar={toggleSidebar} handleLogout={handleLogout} showLogout={true} />
          <main className="container-fluid p-4">
             <Routes>
                <Route path="vote" element={<VotePage />} />
                <Route path="results" element={<ResultPage />} />
                <Route path="*" element={<Navigate to="vote" replace />} />
             </Routes>
          </main>
       </div>
    </div>
  );
};

export default UserDashboard;