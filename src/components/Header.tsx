import React from 'react';
import { Button } from 'react-bootstrap';
import './Header.css';

const Header = ({ toggleSidebar, handleLogout, showLogout }) => {
    return (
        <header className="header">
            <div className="header-content">
                <Button variant="outline-light" onClick={toggleSidebar}>
                    <i className="bi bi-list"></i>
                </Button>
                <h1 className="header-title">Admin Dashboard</h1>
                {showLogout && (
                    <Button variant="outline-light" onClick={handleLogout}>
                        Logout
                    </Button>
                )}
            </div>
        </header>
    );
};

export default Header;