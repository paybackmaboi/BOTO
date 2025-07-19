import { useState } from 'react';
import Sidebar from './Sidebar';
import { Button } from 'react-bootstrap';

const MainLayout = ({ links, children, handleLogout, title }) => {
    const [isOpen, setIsOpen] = useState(true);
    const toggle = () => setIsOpen(!isOpen);

    return (
        <div className="d-flex">
            <Sidebar isOpen={isOpen} toggle={toggle} links={links} handleLogout={handleLogout} />
            <div className={`p-4 w-100`}>
                <div className="d-flex justify-content-between align-items-center mb-4">
                    <Button variant="primary" onClick={toggle}>Menu</Button>
                    <h2>{title}</h2>
                </div>
                {children}
            </div>
        </div>
    );
};

export default MainLayout;