import { NavLink } from 'react-router-dom';
import '../Sidebar.css';

const AdminSidebar = () => {
  return (
    <div className="sidebar-container">
      <div className="sidebar-heading">Admin Menu</div>
      <ul className="sidebar-nav">
        <li>
          <NavLink to="/admin/positions" className="nav-link">Positions</NavLink>
        </li>
        <li>
          <NavLink to="/admin/candidates" className="nav-link">Candidates</NavLink>
        </li>
        <li>
          <NavLink to="/admin/voters" className="nav-link">Voters</NavLink>
        </li>
      </ul>
    </div>
  );
};

export default AdminSidebar;