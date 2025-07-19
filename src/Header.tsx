import React from 'react';
import './Header.css';

interface HeaderProps {
  toggleSidebar: () => void;
}

const Header: React.FC<HeaderProps> = ({ toggleSidebar }) => {
  return (
    <header className="app-header">
      <button className="sidebar-toggle-btn" onClick={toggleSidebar}>
        &#9776;
      </button>
    </header>
  );
};

export default Header;