import { NavLink } from 'react-router-dom';
import '../Sidebar.css';

const UserSidebar = () => {
  return (
    <div className="sidebar-container">
      <div className="sidebar-heading">Voter Menu</div>
      <ul className="sidebar-nav">
        <li>
            <NavLink to="/user/vote" className="nav-link">Vote</NavLink>
        </li>
        <li>
            <NavLink to="/user/results" className="nav-link">Results</NavLink>
        </li>
      </ul>
    </div>
  );
};

export default UserSidebar;