import { Container, Row, Col } from 'react-bootstrap';
import Login from '../components/Login';
import './HomePage.css';

interface HomePageProps {
  setAdminLoggedIn: (isLoggedIn: boolean) => void;
  setUserLoggedIn: (isLoggedIn: boolean) => void;
}

const HomePage: React.FC<HomePageProps> = ({ setAdminLoggedIn, setUserLoggedIn }) => {
  return (
    <Container fluid className="p-0">
      <div className="hero-section-home text-center text-white">
        <h1 className="display-4">Online Voting System</h1>
        <p className="lead">Your Voice, Your Future</p>
      </div>
      <Container className="mt-5">
        <Row className="justify-content-center">
          <Col md={8} lg={6}>
            <Login setAdminLoggedIn={setAdminLoggedIn} setUserLoggedIn={setUserLoggedIn} />
          </Col>
        </Row>
      </Container>
    </Container>
  );
};

export default HomePage;