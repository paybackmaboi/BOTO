import React, { useState } from 'react';
import Header from './Header';
import Sidebar from './Sidebar';
import './MainLayout.css';

const MainLayout = ({ children, links, handleLogout, title }) => {
    const [isSidebarOpen, setSidebarOpen] = useState(true);

    const toggleSidebar = () => {
        setSidebarOpen(!isSidebarOpen);
    };

    return (
        <div className="main-layout">
            <Sidebar isOpen={isSidebarOpen} links={links} />
            <div className={`content ${isSidebarOpen ? 'shifted' : ''}`}>
                <Header 
                    toggleSidebar={toggleSidebar} 
                    handleLogout={handleLogout} 
                    showLogout={true}
                    title={title}
                />
                <main className="main-content">
                    {children}
                </main>
            </div>
        </div>
    );
};

export default MainLayout;