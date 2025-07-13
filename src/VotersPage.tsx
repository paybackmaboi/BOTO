import React, { useState, useEffect } from 'react';
import {
  Container,
  Row,
  Col,
  Form,
  Button,
  Table,
  Badge,
} from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

interface Voter {
  id: string;
  name: string;
  schoolId: string;
  registeredAt: string;
}

interface Candidate {
  id: string;
  firstName: string;
  lastName: string;
  position: string;
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
const STORAGE_CANDIDATES = 'voting-candidates';

const VoterManagement: React.FC = () => {
  const [voters, setVoters] = useState<Voter[]>([]);
  const [votes, setVotes] = useState<Vote[]>([]);
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [name, setName] = useState('');
  const [schoolId, setSchoolId] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const storedVoters = JSON.parse(localStorage.getItem(STORAGE_VOTERS) || '[]');
    const storedVotes = JSON.parse(localStorage.getItem(STORAGE_VOTES) || '[]');
    const storedCandidates = JSON.parse(localStorage.getItem(STORAGE_CANDIDATES) || '[]');

    setVoters(storedVoters);
    setVotes(storedVotes);
    setCandidates(storedCandidates);
  }, []);

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !schoolId) return alert('All fields are required.');
    if (voters.some(v => v.schoolId === schoolId)) {
      return alert('Voter with this School ID already exists.');
    }
    const newVoter: Voter = {
      id: 'voter-' + Date.now(),
      name,
      schoolId,
      registeredAt: new Date().toISOString(),
    };
    const updatedVoters = [...voters, newVoter];
    setVoters(updatedVoters);
    localStorage.setItem(STORAGE_VOTERS, JSON.stringify(updatedVoters));
    setName('');
    setSchoolId('');
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

  const renderVotedFor = (voterId: string) => {
    const voterVotes = votes.filter(v => v.voterId === voterId);
    if (voterVotes.length === 0) return 'N/A';
    return voterVotes
      .map(vote => {
        const candidate = candidates.find(c => c.id === vote.candidateId);
        return candidate
          ? `${candidate.firstName} ${candidate.lastName} (${vote.position})`
          : vote.position;
      })
      .join(', ');
  };

  const renderVoteTime = (voterId: string) => {
    const voterVotes = votes.filter(v => v.voterId === voterId);
    return voterVotes.length
      ? new Date(voterVotes[voterVotes.length - 1].timestamp).toLocaleString()
      : 'N/A';
  };

  return (
    <Container className="mt-4">
      <h2 className="text-primary fw-bold">Voter Management</h2>

      <Form className="bg-white p-4 rounded shadow-sm mb-4" onSubmit={handleRegister}>
        <h4>Register New Voter</h4>
        <Row>
          <Col md={5}>
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
          <Col md={5}>
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
          <Col md={2} className="d-flex align-items-end">
            <Button variant="primary" type="submit" className="w-100">
              Register
            </Button>
          </Col>
        </Row>
      </Form>

      <Form.Group className="mb-3">
        <Form.Control
          type="text"
          placeholder="Search voters..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </Form.Group>

      <Table bordered hover responsive className="bg-white rounded shadow-sm">
        <thead className="table-light">
          <tr>
            <th>Name</th>
            <th>School ID</th>
            <th>Status</th>
            <th>Voted For</th>
            <th>Time Voted</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredVoters.map(voter => {
            const hasVoted = votes.some(v => v.voterId === voter.id);
            return (
              <tr key={voter.id}>
                <td>{voter.name}</td>
                <td>{voter.schoolId}</td>
                <td>
                  <Badge bg={hasVoted ? 'success' : 'danger'}>
                    {hasVoted ? 'Voted' : 'Not Voted'}
                  </Badge>
                </td>
                <td>{renderVotedFor(voter.id)}</td>
                <td>{renderVoteTime(voter.id)}</td>
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
