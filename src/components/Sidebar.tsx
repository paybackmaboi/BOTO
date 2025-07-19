import React from 'react';
import { Nav } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import './Sidebar.css';

const Sidebar = ({ isOpen }) => {
    return (
        <div className={`sidebar ${isOpen ? 'open' : ''}`}>
            <Nav className="flex-column">
                <Nav.Link as={Link} to="/admin/dashboard">Dashboard</Nav.Link>
                <Nav.Link as={Link} to="/admin/election">Election</Nav.Link>
                <Nav.Link as={Link} to="/admin/candidates">Candidates</Nav.Link>
                <Nav.Link as={Link} to="/admin/voters">Voters</Nav.Link>
            </Nav>
        </div>
    );
};

export default Sidebar;