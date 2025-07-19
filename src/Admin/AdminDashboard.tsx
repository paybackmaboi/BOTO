import { Routes, Route } from 'react-router-dom';
import CandidatesPage from './pages/CandidatesPage';
import PositionsPage from './pages/PositionsPage';
import VotersPage from './pages/VotersPage';
import MainLayout from '../components/MainLayout'; // Assuming you have a layout with a sidebar

const AdminDashboard = ({ setAdminLoggedIn }) => {
  return (
    // You would wrap your pages in a layout component
    <MainLayout logoutHandler={() => setAdminLoggedIn(false)}>
      <Routes>
        {/* The default page for /admin/ */}
        <Route index element={<h2>Welcome Admin!</h2>} /> 
        
        {/* Note: no leading slash in nested routes */}
        <Route path="candidates" element={<CandidatesPage />} />
        <Route path="positions" element={<PositionsPage />} />
        <Route path="voters" element={<VotersPage />} />
      </Routes>
    </MainLayout>
  );
};

export default AdminDashboard;