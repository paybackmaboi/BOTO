import { useState } from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import AdminSidebar from '../components/AdminSidebar';
import PositionsPage from './pages/PositionsPage';
import CandidatesPage from './pages/CandidatesPage';
import VotersPage from './pages/VotersPage';
import '../App.css';

interface AdminDashboardProps {
    setAdminLoggedIn: (isLoggedIn: boolean) => void;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ setAdminLoggedIn }) => {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();

  const toggleSidebar = () => {
    setSidebarOpen(!isSidebarOpen);
  };

  const handleLogout = () => {
    setAdminLoggedIn(false);
    navigate('/', { replace: true });
  };


  return (
    <div className="App">
       <div className={`overlay ${isSidebarOpen ? 'show' : ''}`} onClick={toggleSidebar}></div>
       <AdminSidebar />
       <div className="main-content">
          <Header toggleSidebar={toggleSidebar} handleLogout={handleLogout} showLogout={true} />
          <main className="container-fluid p-4">
             <Routes>
                <Route path="positions" element={<PositionsPage />} />
                <Route path="candidates" element={<CandidatesPage />} />
                <Route path="voters" element={<VotersPage />} />
                <Route path="*" element={<Navigate to="positions" replace />} />
             </Routes>
          </main>
       </div>
    </div>
  );
};

export default AdminDashboard;