import React, { useEffect, useState } from 'react';
import { Button, Container, Form, Alert, Card, Row, Col, InputGroup } from 'react-bootstrap';

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
  const [selectedCandidateId, setSelectedCandidateId] = useState<string | null>(null); // State for selected radio button

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
        const initialPositionIndex = savedProgress ? parseInt(savedProgress) : 0;
        setCurrentPositionIndex(initialPositionIndex);

        // If resuming a vote, set the pre-selected candidate if one exists for the current position
        if (pos.length > 0 && initialPositionIndex < pos.length) {
          const currentPositionName = pos[initialPositionIndex].name;
          const existingVote = storedVotes.find(
            v => v.voterId === found.id && v.position === currentPositionName
          );
          if (existingVote) {
            setSelectedCandidateId(existingVote.candidateId);
          } else {
            setSelectedCandidateId(null);
          }
        }
      } else {
        localStorage.removeItem(STORAGE_CURRENT_VOTER_SESSION);
      }
    }
  }, []);

  // Effect to reset selectedCandidateId when currentPositionIndex changes
  useEffect(() => {
    if (voter && positions.length > 0 && currentPositionIndex < positions.length) {
      const currentPositionName = positions[currentPositionIndex].name;
      const existingVote = votes.find(
        v => v.voterId === voter.id && v.position === currentPositionName
      );
      setSelectedCandidateId(existingVote ? existingVote.candidateId : null);
    } else {
      setSelectedCandidateId(null);
    }
  }, [currentPositionIndex, voter, positions, votes]);


  function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    const regVoters: Voter[] = JSON.parse(localStorage.getItem(STORAGE_VOTERS) || '[]');
    const found = regVoters.find(v => v.schoolId === schoolId.trim());
    if (found) {
      setVoter(found);
      localStorage.setItem(STORAGE_CURRENT_VOTER_SESSION, found.id);
      setCurrentPositionIndex(0); // Reset progress on new login
      setLoginError(false); // Clear any previous login errors

      // Check for existing vote for the first position if voter has existing votes
      if (positions.length > 0) {
        const currentPositionName = positions[0].name;
        const existingVote = votes.find(
          v => v.voterId === found.id && v.position === currentPositionName
        );
        setSelectedCandidateId(existingVote ? existingVote.candidateId : null);
      }
    } else {
      setLoginError(true);
    }
  }

  function handleVoteSubmit() {
    if (!voter || !selectedCandidateId || currentPositionIndex >= positions.length) return;

    const currentPosition = positions[currentPositionIndex];
    const candidateToVoteFor = candidates.find(c => c.id === selectedCandidateId);

    if (!candidateToVoteFor) {
      alert('Please select a candidate to vote.');
      return;
    }

    const newVote: Vote = {
      voterId: voter.id,
      position: currentPosition.name,
      candidateId: candidateToVoteFor.id,
      candidateName: `${candidateToVoteFor.firstName} ${candidateToVoteFor.lastName}`,
      timestamp: new Date().toISOString(),
    };

    // Remove existing vote for this position by this voter before adding the new one
    const updatedVotes = votes.filter(
      v => !(v.voterId === voter.id && v.position === currentPosition.name)
    );
    updatedVotes.push(newVote);

    setVotes(updatedVotes);
    localStorage.setItem(STORAGE_VOTES, JSON.stringify(updatedVotes));

    // Save voting progress
    const nextPositionIndex = currentPositionIndex + 1;
    localStorage.setItem(
      STORAGE_VOTING_PROGRESS + voter.id,
      nextPositionIndex.toString()
    );

    setCurrentPositionIndex(nextPositionIndex);
    setSelectedCandidateId(null); // Clear selection for the next position
  }

  function resetVotes() {
    if (!voter) return;
    const filtered = votes.filter(v => v.voterId !== voter.id);
    setVotes(filtered);
    setCurrentPositionIndex(0);
    localStorage.setItem(STORAGE_VOTES, JSON.stringify(filtered));
    localStorage.removeItem(STORAGE_VOTING_PROGRESS + voter.id);
    setSelectedCandidateId(null); // Clear selection
  }

  function logout() {
    setVoter(null);
    setSchoolId('');
    setCurrentPositionIndex(0);
    localStorage.removeItem(STORAGE_CURRENT_VOTER_SESSION);
    setSelectedCandidateId(null); // Clear selection on logout
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

  // Determine if the current position is 'President' to apply the specific UI
  const isPresidentPosition = currentPosition.name.toLowerCase() === 'president';

  return (
    <Container className="my-5">
      <h2 className="text-primary mb-4">Vote for {currentPosition.name}</h2>

      {isPresidentPosition ? (
        // UI for President position, matching the image style
        <Card className="p-4 shadow" style={{ maxWidth: '500px', margin: 'auto' }}>
          {currentCandidates.length === 0 ? (
            <p className="text-center text-muted">No candidates for {currentPosition.name} yet.</p>
          ) : (
            currentCandidates.map(candidate => (
              <InputGroup key={candidate.id} className="mb-3">
                <InputGroup.Text className="w-100 d-flex justify-content-between align-items-center">
                  <Form.Check
                    type="radio"
                    id={`candidate-${candidate.id}`}
                    name="presidentCandidate" // All radio buttons for this position share the same name
                    label={`${candidate.firstName} ${candidate.lastName}`}
                    checked={selectedCandidateId === candidate.id}
                    onChange={() => setSelectedCandidateId(candidate.id)}
                    className="flex-grow-1" // Make label take up available space
                  />
                  {/* The red X is removed as per your request */}
                </InputGroup.Text>
              </InputGroup>
            ))
          )}
          <Button
            variant="primary"
            onClick={handleVoteSubmit}
            className="w-100 mt-3"
            disabled={!selectedCandidateId} // Disable if no candidate is selected
          >
            Vote for {currentPosition.name}
          </Button>
        </Card>
      ) : (
        // Original UI for other positions (Card-based display)
        <Row>
          {currentCandidates.map(candidate => (
            <Col key={candidate.id} md={4} className="mb-4">
              <Card className="h-100">
                {candidate.photo && (
                  <Card.Img variant="top" src={candidate.photo} alt={`${candidate.firstName} ${candidate.lastName}`} />
                )}
                <Card.Body>
                  <Card.Title>{`${candidate.firstName} ${candidate.lastName}`}</Card.Title>
                  <Card.Text>{candidate.position}</Card.Text>
                  <Button
                    variant="primary"
                    onClick={() => {
                      setSelectedCandidateId(candidate.id); // Set selected candidate for this card
                      handleVoteSubmit(); // Submit vote immediately
                    }}
                    disabled={selectedCandidateId === candidate.id} // Disable if already selected (though voteSubmit will move to next)
                  >
                    {selectedCandidateId === candidate.id ? 'Selected' : 'Vote'}
                  </Button>
                </Card.Body>
              </Card>
            </Col>
          ))}
          {/* A general "Next" or "Submit" button if not immediately submitting from card */}
          {currentCandidates.length > 0 && (
             <Col xs={12} className="text-center mt-3">
               <Button
                 variant="primary"
                 onClick={handleVoteSubmit}
                 disabled={!selectedCandidateId} // Ensure a selection is made
               >
                 Submit Vote for {currentPosition.name}
               </Button>
             </Col>
           )}
        </Row>
      )}

      <div className="mt-4 text-center">
        {currentPositionIndex > 0 && (
          <Button
            variant="outline-secondary"
            onClick={() => setCurrentPositionIndex(prev => prev - 1)}
            className="me-2"
          >
            Previous Position
          </Button>
        )}
        <Button variant="secondary" onClick={logout}>Logout</Button>
      </div>
    </Container>
  );
}