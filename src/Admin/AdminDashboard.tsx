import React from 'react';
import { Routes, Route } from 'react-router-dom';
import MainLayout from '../components/MainLayout';
import Dashboard from './pages/Dashboard';
import Election from './pages/Election';
import Candidates from './pages/Candidates';
import Voters from './pages/Voters';

const AdminDashboard = ({ setAdminLoggedIn }) => {
    const adminLinks = [
        { path: '/admin/dashboard', name: 'Dashboard' },
        { path: '/admin/election', name: 'Election' },
        { path: '/admin/candidates', name: 'Candidates' },
        { path: '/admin/voters', name: 'Voters' },
    ];

    return (
        <MainLayout links={adminLinks} handleLogout={() => setAdminLoggedIn(false)} title="Admin Dashboard">
            <Routes>
                <Route path="dashboard" element={<Dashboard />} />
                <Route path="election" element={<Election />} />
                <Route path="candidates" element={<Candidates />} />
                <Route path="voters" element={<Voters />} />
            </Routes>
        </MainLayout>
    );
};

export default AdminDashboard;