import React from 'react';
import { NavLink } from 'react-router-dom';
import './Sidebar.css';

interface SidebarProps {
  isOpen: boolean;
  closeSidebar: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, closeSidebar }) => {
  return (
    <div className={`sidebar ${isOpen ? 'open' : ''}`}>
      <ul className="sidebar-nav">
        <li className="nav-item">
          <NavLink to="/" className="nav-link" onClick={closeSidebar}>Home</NavLink>
        </li>
        <li className="nav-item">
          <NavLink to="/positions" className="nav-link" onClick={closeSidebar}>Positions</NavLink>
        </li>
        <li className="nav-item">
          <NavLink to="/candidates" className="nav-link" onClick={closeSidebar}>Candidates</NavLink>
        </li>
        <li className="nav-item">
          <NavLink to="/voters" className="nav-link" onClick={closeSidebar}>Voters</NavLink>
        </li>
        <li className="nav-item">
          <NavLink to="/vote" className="nav-link" onClick={closeSidebar}>Vote</NavLink>
        </li>
        <li className="nav-item">
          <NavLink to="/results" className="nav-link" onClick={closeSidebar}>Results</NavLink>
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;