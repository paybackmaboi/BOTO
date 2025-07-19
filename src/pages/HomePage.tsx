import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Row, Col, Card, Form, Button, Alert } from 'react-bootstrap';

const HomePage = ({ setAdminLoggedIn, setUserLoggedIn }) => {
    const navigate = useNavigate();
    const [adminUsername, setAdminUsername] = useState('');
    const [adminPassword, setAdminPassword] = useState('');
    const [userEmail, setUserEmail] = useState('');
    const [userPassword, setUserPassword] = useState('');
    const [error, setError] = useState('');

    const handleAdminLogin = (e) => {
        e.preventDefault();
        // Replace with your actual authentication logic
        if (adminUsername === 'admin' && adminPassword === 'password') {
            setAdminLoggedIn(true);
            navigate('/admin/dashboard');
        } else {
            setError('Invalid admin credentials');
        }
    };

    const handleUserLogin = (e) => {
        e.preventDefault();
        // Replace with your actual authentication logic
        if (userEmail === 'user@example.com' && userPassword === 'password') {
            setUserLoggedIn(true);
            navigate('/user/dashboard');
        } else {
            setError('Invalid user credentials');
        }
    };

    return (
        <Container fluid className="vh-100 d-flex align-items-center justify-content-center bg-light">
            <Row>
                <Col md={6} className="mb-4">
                    <Card>
                        <Card.Body>
                            <Card.Title className="text-center">Admin Login</Card.Title>
                            <Form onSubmit={handleAdminLogin}>
                                <Form.Group className="mb-3" controlId="formAdminUsername">
                                    <Form.Label>Username</Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder="Enter username"
                                        value={adminUsername}
                                        onChange={(e) => setAdminUsername(e.target.value)}
                                    />
                                </Form.Group>
                                <Form.Group className="mb-3" controlId="formAdminPassword">
                                    <Form.Label>Password</Form.Label>
                                    <Form.Control
                                        type="password"
                                        placeholder="Password"
                                        value={adminPassword}
                                        onChange={(e) => setAdminPassword(e.target.value)}
                                    />
                                </Form.Group>
                                <Button variant="primary" type="submit" className="w-100">
                                    Login as Admin
                                </Button>
                            </Form>
                        </Card.Body>
                    </Card>
                </Col>
                <Col md={6}>
                    <Card>
                        <Card.Body>
                            <Card.Title className="text-center">User Login</Card.Title>
                            <Form onSubmit={handleUserLogin}>
                                <Form.Group className="mb-3" controlId="formUserEmail">
                                    <Form.Label>Email address</Form.Label>
                                    <Form.Control
                                        type="email"
                                        placeholder="Enter email"
                                        value={userEmail}
                                        onChange={(e) => setUserEmail(e.target.value)}
                                    />
                                </Form.Group>
                                <Form.Group className="mb-3" controlId="formUserPassword">
                                    <Form.Label>Password</Form.Label>
                                    <Form.Control
                                        type="password"
                                        placeholder="Password"
                                        value={userPassword}
                                        onChange={(e) => setUserPassword(e.target.value)}
                                    />
                                </Form.Group>
                                <Button variant="secondary" type="submit" className="w-100">
                                    Login as User
                                </Button>
                            </Form>
                        </Card.Body>
                    </Card>
                </Col>
                {error && (
                    <Col xs={12} className="mt-3">
                        <Alert variant="danger" onClose={() => setError('')} dismissible>
                            {error}
                        </Alert>
                    </Col>
                )}
            </Row>
        </Container>
    );
};

export default HomePage;