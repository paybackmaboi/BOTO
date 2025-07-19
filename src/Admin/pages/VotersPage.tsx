import React, { useState, useEffect } from 'react';
import {
  Container,
  Row,
  Col,
  Form,
  Button,
  Table,
  Badge,
  Image, // Import Image component for displaying photos
} from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

interface Voter {
  id: string;
  name: string;
  schoolId: string;
  registeredAt: string;
  photo?: string; // Add optional photo field (Base64 string)
}

interface Vote {
  voterId: string;
  position: string;
  candidateId: string;
  candidateName: string;
  timestamp: string;
}

const STORAGE_VOTERS = 'voting-voters';
const STORAGE_VOTES = 'voting-votes';

const VoterManagement: React.FC = () => {
  const [voters, setVoters] = useState<Voter[]>([]);
  const [votes, setVotes] = useState<Vote[]>([]);
  const [name, setName] = useState('');
  const [schoolId, setSchoolId] = useState('');
  const [photo, setPhoto] = useState<string | null>(null); // State to store Base64 photo
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const storedVoters = JSON.parse(localStorage.getItem(STORAGE_VOTERS) || '[]');
    const storedVotes = JSON.parse(localStorage.getItem(STORAGE_VOTES) || '[]');
    setVoters(storedVoters);
    setVotes(storedVotes);
  }, []);

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhoto(reader.result as string); // Store Base64 string
      };
      reader.readAsDataURL(file);
    } else {
      setPhoto(null);
    }
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !schoolId) return alert('Name and School ID are required.');
    if (voters.some(v => v.schoolId === schoolId)) {
      return alert('Voter with this School ID already exists.');
    }

    const newVoter: Voter = {
      id: 'voter-' + Date.now(),
      name,
      schoolId,
      registeredAt: new Date().toISOString(),
      photo: photo || undefined, // Add photo if available
    };
    const updatedVoters = [...voters, newVoter];
    setVoters(updatedVoters);
    localStorage.setItem(STORAGE_VOTERS, JSON.stringify(updatedVoters));
    setName('');
    setSchoolId('');
    setPhoto(null); // Clear photo input after registration
    const photoInput = document.getElementById('voterPhoto') as HTMLInputElement;
    if (photoInput) {
      photoInput.value = '';
    }
  };

  const handleDelete = (voterId: string) => {
    if (window.confirm('Are you sure you want to delete this voter?')) {
      const updatedVoters = voters.filter(v => v.id !== voterId);
      setVoters(updatedVoters);
      localStorage.setItem(STORAGE_VOTERS, JSON.stringify(updatedVoters));
    }
  };

  const filteredVoters = voters.filter(v =>
    v.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    v.schoolId.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Container className="mt-4">
      <h2 className="text-primary fw-bold">Voter Management</h2>

      <Form className="bg-white p-4 rounded shadow-sm mb-4" onSubmit={handleRegister}>
        <h4>Register New Voter</h4>
        <Row>
          <Col md={4}>
            <Form.Group className="mb-3">
              <Form.Label>Full Name</Form.Label>
              <Form.Control
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </Form.Group>
          </Col>
          <Col md={4}>
            <Form.Group className="mb-3">
              <Form.Label>School ID</Form.Label>
              <Form.Control
                type="text"
                value={schoolId}
                onChange={(e) => setSchoolId(e.target.value)}
                required
              />
            </Form.Group>
          </Col>
          <Col md={4}>
            <Form.Group className="mb-3">
              <Form.Label>Voter Photo (Optional)</Form.Label>
              <Form.Control
                id="voterPhoto" // Add an ID to easily clear the input
                type="file"
                accept="image/*" // Accept only image files
                onChange={handlePhotoChange}
              />
            </Form.Group>
          </Col>
        </Row>
        <Row>
          <Col>
            <Button variant="primary" type="submit" className="w-100">
              Register Voter
            </Button>
          </Col>
        </Row>
      </Form>

      <Form.Group className="mb-3">
        <Form.Control
          type="text"
          placeholder="Search voters by name or school ID..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </Form.Group>

      <Table bordered hover responsive className="bg-white rounded shadow-sm">
        <thead className="table-light">
          <tr>
            <th>Photo</th> {/* New column for photo */}
            <th>Name</th>
            <th>School ID</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredVoters.map(voter => {
            const hasVoted = votes.some(v => v.voterId === voter.id);
            return (
              <tr key={voter.id}>
                <td>
                  {voter.photo ? (
                    <Image
                      src={voter.photo}
                      alt={`${voter.name}'s photo`}
                      style={{ width: '50px', height: '50px', objectFit: 'cover', borderRadius: '5px' }}
                      thumbnail
                    />
                  ) : (
                    'N/A'
                  )}
                </td>
                <td>{voter.name}</td>
                <td>{voter.schoolId}</td>
                <td>
                  <Badge bg={hasVoted ? 'success' : 'secondary'}>
                    {hasVoted ? 'Voted' : 'Not Voted'}
                  </Badge>
                </td>
                <td>
                  <Button variant="danger" size="sm" onClick={() => handleDelete(voter.id)}>
                    Delete
                  </Button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </Table>
    </Container>
  );
};

export default VoterManagement;