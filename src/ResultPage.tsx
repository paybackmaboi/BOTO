import { useEffect, useState } from 'react';
import { Container, Row, Col, Card, Carousel, Button } from 'react-bootstrap';
import Chart from 'chart.js/auto';

const STORAGE_POSITIONS = 'voting-positions';
const STORAGE_CANDIDATES = 'voting-candidates';
const STORAGE_VOTERS = 'voting-voters';
const STORAGE_VOTES = 'voting-votes';

export default function DashboardPage() {
  const [positions, setPositions] = useState<any[]>([]);
  const [candidates, setCandidates] = useState<any[]>([]);
  const [voters, setVoters] = useState<Set<string>>(new Set());
  const [votes, setVotes] = useState<any[]>([]);
  const [votersVoted, setVotersVoted] = useState<Set<string>>(new Set());

  useEffect(() => {
    const pos = JSON.parse(localStorage.getItem(STORAGE_POSITIONS) || '[]');
    const cands = JSON.parse(localStorage.getItem(STORAGE_CANDIDATES) || '[]');
    const votr = new Set(JSON.parse(localStorage.getItem(STORAGE_VOTERS) || '[]'));
    const vts = JSON.parse(localStorage.getItem(STORAGE_VOTES) || '[]');

    setPositions(pos);
    setCandidates(cands);
    setVoters(votr);
    setVotes(vts);
    setVotersVoted(new Set(vts.map((v: any) => v.voterId)));
  }, []);

  useEffect(() => {
    positions.forEach((pos, idx) => {
      const canvasId = `chart-${idx}`;
      const canvas = document.getElementById(canvasId) as HTMLCanvasElement;
      if (!canvas) return;

      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const voteCounts: Record<string, number> = {};
      const cands = candidates.filter(c => c.position === pos.name);

      cands.forEach(c => {
        const fullName = `${c.firstName} ${c.lastName}`;
        voteCounts[fullName] = 0;
      });

      votes.forEach(v => {
        if (v.position === pos.name) {
          const cand = cands.find(c => c.id === v.candidateId);
          if (cand) {
            const fullName = `${cand.firstName} ${cand.lastName}`;
            voteCounts[fullName] = (voteCounts[fullName] || 0) + 1;
          }
        }
      });

      const chart = new Chart(ctx, {
        type: 'pie',
        data: {
          labels: Object.keys(voteCounts).length ? Object.keys(voteCounts) : ['No candidates'],
          datasets: [
            {
              label: 'Votes',
              data: Object.values(voteCounts).length ? Object.values(voteCounts) : [1],
              backgroundColor: Object.keys(voteCounts).map(() =>
                `rgba(${Math.floor(Math.random() * 255)}, ${Math.floor(
                  Math.random() * 255
                )}, ${Math.floor(Math.random() * 255)}, 0.7)`
              ),
              borderColor: '#fff',
              borderWidth: 2,
            },
          ],
        },
        options: {
          plugins: {
            legend: {
              position: 'top',
            },
          },
        },
      });

      return () => {
        chart.destroy();
      };
    });
  }, [positions, candidates, votes]);

  return (
    <Container fluid className="p-4">
      <h2 className="text-primary fw-bold mb-4">Dashboard</h2>
      <Row className="mb-5 g-4">
        <Col md={3} xs={6}>
          <Card className="text-center p-4 shadow-sm">
            <Card.Title className="text-primary">Positions</Card.Title>
            <h2 className="fw-bold text-primary">{positions.length}</h2>
          </Card>
        </Col>
        <Col md={3} xs={6}>
          <Card className="text-center p-4 shadow-sm">
            <Card.Title className="text-primary">Candidates</Card.Title>
            <h2 className="fw-bold text-primary">{candidates.length}</h2>
          </Card>
        </Col>
        <Col md={3} xs={6}>
          <Card className="text-center p-4 shadow-sm">
            <Card.Title className="text-primary">Voters</Card.Title>
            <h2 className="fw-bold text-primary">{voters.size}</h2>
          </Card>
        </Col>
        <Col md={3} xs={6}>
          <Card className="text-center p-4 shadow-sm">
            <Card.Title className="text-primary">Voters Voted</Card.Title>
            <h2 className="fw-bold text-primary">{votersVoted.size}</h2>
          </Card>
        </Col>
      </Row>

      <Carousel indicators={false} interval={null}>
        {positions.map((pos, index) => (
          <Carousel.Item key={index}>
            <Card className="p-4 text-center shadow-lg">
              <h4 className="text-primary mb-4 fw-bold">{pos.name}</h4>
              <canvas id={`chart-${index}`} role="img" aria-label={`${pos.name} vote chart`} />
            </Card>
          </Carousel.Item>
        ))}
      </Carousel>
    </Container>
  );
}
