import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Form, Button, Card, Row, Col, Alert, Tab, Nav } from 'react-bootstrap';

interface LoginProps {
  setAdminLoggedIn: (isLoggedIn: boolean) => void;
  setUserLoggedIn: (isLoggedIn: boolean) => void;
}

const Login: React.FC<LoginProps> = ({ setAdminLoggedIn, setUserLoggedIn }) => {
  const [adminUsername, setAdminUsername] = useState('');
  const [adminPassword, setAdminPassword] = useState('');
  const [userSchoolId, setUserSchoolId] = useState('');
  const [adminError, setAdminError] = useState('');
  const [userError, setUserError] = useState('');
  const navigate = useNavigate();

  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real application, you would have more secure authentication
    if (adminUsername === 'admin' && adminPassword === 'password') {
      setAdminLoggedIn(true);
      navigate('/admin/positions');
    } else {
      setAdminError('Invalid admin credentials.');
    }
  };

  const handleUserLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const storedVoters = JSON.parse(localStorage.getItem('voting-voters') || '[]');
    const voter = storedVoters.find((v: any) => v.schoolId === userSchoolId);
    if (voter) {
      setUserLoggedIn(true);
      localStorage.setItem('current-voter-session', voter.id);
      navigate('/user/vote');
    } else {
      setUserError('Invalid school ID. Please contact an administrator if you believe this is an error.');
    }
  };

  return (
    <Card>
      <Card.Body>
        <Tab.Container defaultActiveKey="user-login">
          <Nav variant="tabs" className="justify-content-center">
            <Nav.Item>
              <Nav.Link eventKey="user-login">Voter Login</Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link eventKey="admin-login">Admin Login</Nav.Link>
            </Nav.Item>
          </Nav>
          <Tab.Content className="p-3">
            <Tab.Pane eventKey="user-login">
              <h3 className="text-center mb-4">Voter Login</h3>
              <Form onSubmit={handleUserLogin}>
                {userError && <Alert variant="danger">{userError}</Alert>}
                <Form.Group className="mb-3">
                  <Form.Label>School ID</Form.Label>
                  <Form.Control
                    type="text"
                    value={userSchoolId}
                    onChange={(e) => setUserSchoolId(e.target.value)}
                    placeholder="Enter your School ID"
                    required
                  />
                </Form.Group>
                <Button type="submit" variant="success" className="w-100">
                  Login as Voter
                </Button>
              </Form>
            </Tab.Pane>
            <Tab.Pane eventKey="admin-login">
              <h3 className="text-center mb-4">Admin Login</h3>
              <Form onSubmit={handleAdminLogin}>
                {adminError && <Alert variant="danger">{adminError}</Alert>}
                <Form.Group className="mb-3">
                  <Form.Label>Username</Form.Label>
                  <Form.Control
                    type="text"
                    value={adminUsername}
                    onChange={(e) => setAdminUsername(e.target.value)}
                    placeholder="Default: admin"
                    required
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Password</Form.Label>
                  <Form.Control
                    type="password"
                    value={adminPassword}
                    onChange={(e) => setAdminPassword(e.target.value)}
                    placeholder="Default: password"
                    required
                  />
                </Form.Group>
                <Button type="submit" variant="primary" className="w-100">
                  Login as Admin
                </Button>
              </Form>
            </Tab.Pane>
          </Tab.Content>
        </Tab.Container>
      </Card.Body>
    </Card>
  );
};

export default Login;