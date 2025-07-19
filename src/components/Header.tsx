import React from 'react';
import { Button } from 'react-bootstrap';
import './Header.css';

interface HeaderProps {
  toggleSidebar: () => void;
  handleLogout?: () => void;
  showLogout?: boolean;
}

const Header: React.FC<HeaderProps> = ({ toggleSidebar, handleLogout, showLogout }) => {
  return (
    <header className="app-header">
      <button className="sidebar-toggle-btn" onClick={toggleSidebar}>
        &#9776;
      </button>
      <div className="ms-auto">
        {showLogout && (
            <Button variant="outline-light" onClick={handleLogout}>Logout</Button>
        )}
      </div>
    </header>
  );
};

export default Header;