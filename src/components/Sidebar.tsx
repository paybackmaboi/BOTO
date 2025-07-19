import { Nav, Button } from 'react-bootstrap';
import { NavLink } from 'react-router-dom';
import './Sidebar.css'; // This line imports the CSS file

const Sidebar = ({ isOpen, links, handleLogout }) => {
    return (
        <div className={`sidebar ${isOpen ? 'is-open' : ''}`}>
            <div className="sidebar-header">
                <h3>Menu</h3>
            </div>
            <Nav className="flex-column">
                {links.map((link, index) => (
                    <NavLink to={link.path} key={index} className="nav-link">
                        {link.name}
                    </NavLink>
                ))}
            </Nav>
            <Button variant="danger" className="logout-button" onClick={handleLogout}>
                Logout
            </Button>
        </div>
    );
};

export default Sidebar;