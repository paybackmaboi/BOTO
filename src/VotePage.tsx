// src/pages/Votes.tsx
import React, { useEffect, useState } from 'react';
import {Button,Container,Form,Alert,Card,Row,Col,} from 'react-bootstrap';

interface Voter {
  id: string;
  name: string;
  schoolId: string;
}

interface Candidate {
  id: string;
  firstName: string;
  lastName: string;
  position: string;
  photo?: string;
}

interface Position {
  name: string;
}

interface Vote {
  voterId: string;
  position: string;
  candidateId: string;
  candidateName: string;
  timestamp: string;
}

const STORAGE_POSITIONS = 'voting-positions';
const STORAGE_CANDIDATES = 'voting-candidates';
const STORAGE_VOTERS = 'voting-voters';
const STORAGE_VOTES = 'voting-votes';
const STORAGE_CURRENT_VOTER_SESSION = 'current-voter-session';
const STORAGE_VOTING_PROGRESS = 'voting-progress-';

export default function Votes() {
  const [schoolId, setSchoolId] = useState('');
  const [loginError, setLoginError] = useState(false);
  const [voter, setVoter] = useState<Voter | null>(null);
  const [positions, setPositions] = useState<Position[]>([]);
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [votes, setVotes] = useState<Vote[]>([]);
  const [currentPositionIndex, setCurrentPositionIndex] = useState(0);

  useEffect(() => {
    const storedVoterId = localStorage.getItem(STORAGE_CURRENT_VOTER_SESSION);
    const regVoters: Voter[] = JSON.parse(localStorage.getItem(STORAGE_VOTERS) || '[]');
    const storedVotes: Vote[] = JSON.parse(localStorage.getItem(STORAGE_VOTES) || '[]');
    const pos: Position[] = JSON.parse(localStorage.getItem(STORAGE_POSITIONS) || '[]');
    const cands: Candidate[] = JSON.parse(localStorage.getItem(STORAGE_CANDIDATES) || '[]');

    setPositions(pos);
    setCandidates(cands);
    setVotes(storedVotes);

    if (storedVoterId) {
      const found = regVoters.find(v => v.id === storedVoterId);
      if (found) {
        setVoter(found);
        const savedProgress = localStorage.getItem(STORAGE_VOTING_PROGRESS + found.id);
        setCurrentPositionIndex(savedProgress ? parseInt(savedProgress) : 0);
      } else {
        localStorage.removeItem(STORAGE_CURRENT_VOTER_SESSION);
      }
    }
  }, []);

  function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    const regVoters: Voter[] = JSON.parse(localStorage.getItem(STORAGE_VOTERS) || '[]');
    const found = regVoters.find(v => v.schoolId === schoolId.trim());
    if (found) {
      setVoter(found);
      localStorage.setItem(STORAGE_CURRENT_VOTER_SESSION, found.id);
      setCurrentPositionIndex(0);
    } else {
      setLoginError(true);
    }
  }

  function voteFor(candidate: Candidate) {
    if (!voter || currentPositionIndex >= positions.length) return;
    const pos = positions[currentPositionIndex];
    const newVote: Vote = {
      voterId: voter.id,
      position: pos.name,
      candidateId: candidate.id,
      candidateName: `${candidate.firstName} ${candidate.lastName}`,
      timestamp: new Date().toISOString(),
    };
    const updatedVotes = votes.filter(
      v => !(v.voterId === voter.id && v.position === pos.name)
    );
    updatedVotes.push(newVote);
    setVotes(updatedVotes);
    localStorage.setItem(STORAGE_VOTES, JSON.stringify(updatedVotes));
    localStorage.setItem(
      STORAGE_VOTING_PROGRESS + voter.id,
      (currentPositionIndex + 1).toString()
    );
    setCurrentPositionIndex(prev => prev + 1);
  }

  function resetVotes() {
    if (!voter) return;
    const filtered = votes.filter(v => v.voterId !== voter.id);
    setVotes(filtered);
    setCurrentPositionIndex(0);
    localStorage.setItem(STORAGE_VOTES, JSON.stringify(filtered));
    localStorage.removeItem(STORAGE_VOTING_PROGRESS + voter.id);
  }

  function logout() {
    setVoter(null);
    setSchoolId('');
    setCurrentPositionIndex(0);
    localStorage.removeItem(STORAGE_CURRENT_VOTER_SESSION);
  }

  if (!voter) {
    return (
      <Container className="d-flex justify-content-center align-items-center min-vh-100">
  <Card className="p-4 shadow centered-card">
    <h2 className="text-center text-primary">Voter Login</h2>
    <Form onSubmit={handleLogin}>
      <Form.Group className="mb-3">
        <Form.Label>School ID</Form.Label>
        <Form.Control
          value={schoolId}
          onChange={e => setSchoolId(e.target.value)}
          required
        />
      </Form.Group>
      <Button type="submit" variant="primary" className="w-100">
        Login
      </Button>
      {loginError && <Alert variant="danger" className="mt-3">Invalid School ID</Alert>}
    </Form>
  </Card>
</Container>
    );
  }

  if (currentPositionIndex >= positions.length) {
    return (
      <Container className="my-5 text-center">
        <h2 className="text-success">Voting Complete!</h2>
        <p>Thank you for participating.</p>
        <Button variant="secondary" onClick={logout} className="me-2">Vote Again</Button>
        <Button variant="danger" onClick={resetVotes}>Reset My Votes</Button>
      </Container>
    );
  }

  const currentPosition = positions[currentPositionIndex];
  const currentCandidates = candidates.filter(c => c.position === currentPosition.name);
  const alreadyVoted = votes.some(v => v.voterId === voter.id && v.position === currentPosition.name);

  return (
    <Container className="my-4">
      <h2 className="text-primary mb-3">Voting Booth</h2>
      <p className="text-muted">
        Logged in as: <strong>{voter.name}</strong> ({voter.schoolId})
      </p>
      <h4 className="bg-primary text-white p-3 rounded text-center">{currentPosition.name}</h4>
      <Row className="g-3 mt-2">
        {currentCandidates.length === 0 ? (
          <Col><p className="text-muted text-center">No candidates registered.</p></Col>
        ) : (
          currentCandidates.map(candidate => (
            <Col md={6} lg={4} key={candidate.id}>
              <Card className="h-100 shadow text-center">
                <Card.Img
                  variant="top"
                  src={candidate.photo || 'https://via.placeholder.com/300x200?text=Photo'}
                />
                <Card.Body>
                  <Card.Title>{candidate.firstName} {candidate.lastName}</Card.Title>
                  <Card.Text className="text-muted">{candidate.position}</Card.Text>
                  <Button
                    disabled={alreadyVoted}
                    onClick={() => voteFor(candidate)}
                    variant="primary"
                  >
                    {alreadyVoted ? 'Voted' : 'Vote'}
                  </Button>
                </Card.Body>
              </Card>
            </Col>
          ))
        )}
      </Row>
      {alreadyVoted && (
        <div className="text-center mt-4">
          <Button
            onClick={() => setCurrentPositionIndex(prev => prev + 1)}
            className="next-position-btn"
          >
            Proceed to Next Position
          </Button>
        </div>
      )}
      <div className="text-center mt-4">
        <Button variant="secondary" onClick={logout} className="me-2">Vote as Another User</Button>
        <Button variant="danger" onClick={resetVotes}>Reset My Votes</Button>
      </div>
    </Container>
  );
}
