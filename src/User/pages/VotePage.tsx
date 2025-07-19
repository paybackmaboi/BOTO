import React, { useEffect, useState } from 'react';
import { Button, Container, Form, Alert, Card, Row, Col } from 'react-bootstrap';

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
  const [voter, setVoter] = useState<Voter | null>(null);
  const [positions, setPositions] = useState<Position[]>([]);
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [votes, setVotes] = useState<Vote[]>([]);
  const [currentPositionIndex, setCurrentPositionIndex] = useState(0);
  const [selectedCandidateId, setSelectedCandidateId] = useState<string | null>(null);

  useEffect(() => {
    const storedVoterId = localStorage.getItem(STORAGE_CURRENT_VOTER_SESSION);
    if (!storedVoterId) return;

    const regVoters: Voter[] = JSON.parse(localStorage.getItem(STORAGE_VOTERS) || '[]');
    const storedVotes: Vote[] = JSON.parse(localStorage.getItem(STORAGE_VOTES) || '[]');
    const pos: Position[] = JSON.parse(localStorage.getItem(STORAGE_POSITIONS) || '[]');
    const cands: Candidate[] = JSON.parse(localStorage.getItem(STORAGE_CANDIDATES) || '[]');

    setPositions(pos);
    setCandidates(cands);
    setVotes(storedVotes);

    const found = regVoters.find(v => v.id === storedVoterId);
    if (found) {
        setVoter(found);
        const savedProgress = localStorage.getItem(STORAGE_VOTING_PROGRESS + found.id);
        const initialPositionIndex = savedProgress ? parseInt(savedProgress) : 0;
        setCurrentPositionIndex(initialPositionIndex);
    }
  }, []);

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

    const updatedVotes = votes.filter(
      v => !(v.voterId === voter.id && v.position === currentPosition.name)
    );
    updatedVotes.push(newVote);

    setVotes(updatedVotes);
    localStorage.setItem(STORAGE_VOTES, JSON.stringify(updatedVotes));

    const nextPositionIndex = currentPositionIndex + 1;
    localStorage.setItem(STORAGE_VOTING_PROGRESS + voter.id, nextPositionIndex.toString());
    setCurrentPositionIndex(nextPositionIndex);
    setSelectedCandidateId(null);
  }

  if (!voter) {
    return <Container className="text-center mt-5"><Alert variant="warning">Not logged in. Please log in from the home page.</Alert></Container>;
  }

  if (currentPositionIndex >= positions.length) {
    return (
      <Container className="my-5 text-center">
        <Card className="p-5 shadow-lg">
            <Card.Body>
                <h2 className="text-success mb-3">Voting Complete!</h2>
                <p className="lead">Thank you for participating in the election. You can view the results or log out.</p>
            </Card.Body>
        </Card>
      </Container>
    );
  }

  const currentPosition = positions[currentPositionIndex];
  const currentCandidates = candidates.filter(c => c.position === currentPosition.name);

  return (
    <Container className="my-5">
      <h2 className="text-center mb-4">Vote for: <strong>{currentPosition.name}</strong></h2>
      
      <Row className="justify-content-center">
        {currentCandidates.map(candidate => (
          <Col key={candidate.id} md={6} lg={4} className="mb-4">
            <Card
              className={`h-100 text-center ${selectedCandidateId === candidate.id ? 'border-primary' : ''}`}
              onClick={() => setSelectedCandidateId(candidate.id)}
              style={{ cursor: 'pointer' }}
            >
              {candidate.photo && (
                <Card.Img
                  variant="top"
                  src={candidate.photo}
                  alt={`${candidate.firstName} ${candidate.lastName}`}
                  style={{ width: '150px', height: '150px', objectFit: 'cover', borderRadius: '50%', margin: '20px auto 0' }}
                />
              )}
              <Card.Body>
                <Card.Title>{`${candidate.firstName} ${candidate.lastName}`}</Card.Title>
                <Form.Check
                    type="radio"
                    id={`candidate-${candidate.id}`}
                    name="candidateSelection"
                    checked={selectedCandidateId === candidate.id}
                    onChange={() => setSelectedCandidateId(candidate.id)}
                    label="Select"
                  />
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>

      <div className="text-center mt-4">
        <Button
          variant="primary"
          size="lg"
          onClick={handleVoteSubmit}
          disabled={!selectedCandidateId}
        >
          Submit Vote for {currentPosition.name}
        </Button>
      </div>

      <div className="mt-5 d-flex justify-content-between">
        {currentPositionIndex > 0 && (
          <Button
            variant="outline-secondary"
            onClick={() => setCurrentPositionIndex(prev => prev - 1)}
          >
            &larr; Previous Position
          </Button>
        )}
      </div>
    </Container>
  );
}