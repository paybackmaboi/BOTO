import React, { useEffect, useState } from 'react';
import {
  Button,
  Modal,
  Form,
  Table,
  Container,
  Row,
  Col,
  Alert,
} from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

interface Candidate {
  id: string;
  firstName: string;
  lastName: string;
  position: string;
  platform: string;
}

const STORAGE_CANDIDATES = 'voting-candidates';
const STORAGE_POSITIONS = 'voting-positions';

const CandidatesPage: React.FC = () => {
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [positions, setPositions] = useState<string[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    position: '',
    platform: '',
  });
  const [validated, setValidated] = useState(false);

  useEffect(() => {
    const storedCandidates = JSON.parse(
      localStorage.getItem(STORAGE_CANDIDATES) || '[]'
    );
    const storedPositions = JSON.parse(
      localStorage.getItem(STORAGE_POSITIONS) || '[]'
    );
    setCandidates(storedCandidates);
    setPositions(storedPositions.map((p: any) => p.name));
  }, []);

  const saveCandidates = (newCandidates: Candidate[]) => {
    localStorage.setItem(STORAGE_CANDIDATES, JSON.stringify(newCandidates));
    setCandidates(newCandidates);
  };

  const handleAdd = () => {
    setFormData({ firstName: '', lastName: '', position: '', platform: '' });
    setEditId(null);
    setValidated(false);
    setShowModal(true);
  };

  const handleEdit = (id: string) => {
    const candidate = candidates.find((c) => c.id === id);
    if (candidate) {
      setFormData({
        firstName: candidate.firstName,
        lastName: candidate.lastName,
        position: candidate.position,
        platform: candidate.platform,
      });
      setEditId(id);
      setValidated(false);
      setShowModal(true);
    }
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this candidate?')) {
      const updated = candidates.filter((c) => c.id !== id);
      saveCandidates(updated);
    }
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    event.stopPropagation();

    if (
      !formData.firstName.trim() ||
      !formData.lastName.trim() ||
      !formData.position ||
      !formData.platform.trim()
    ) {
      setValidated(true);
      return;
    }

    const newCandidate: Candidate = {
      id: editId || crypto.randomUUID(),
      ...formData,
    };

    const updated = editId
      ? candidates.map((c) => (c.id === editId ? newCandidate : c))
      : [...candidates, newCandidate];

    saveCandidates(updated);
    setShowModal(false);
  };

  return (
    <Container fluid className="p-4 bg-light min-vh-100">
      <Row>
        <Col>
          <h2 className="text-primary">Candidates</h2>
          <Button variant="primary" className="mb-3" onClick={handleAdd}>
            Add Candidate
          </Button>
          <Table bordered hover responsive className="bg-white">
            <thead className="table-primary">
              <tr>
                <th>First Name</th>
                <th>Last Name</th>
                <th>Position</th>
                <th>Platform</th>
                <th style={{ width: '110px' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {candidates.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center py-3">
                    No candidates added yet.
                  </td>
                </tr>
              ) : (
                candidates.map((candidate) => (
                  <tr key={candidate.id}>
                    <td>{candidate.firstName}</td>
                    <td>{candidate.lastName}</td>
                    <td>{candidate.position}</td>
                    <td>{candidate.platform}</td>
                    <td>
                      <Button
                        variant="outline-primary"
                        size="sm"
                        onClick={() => handleEdit(candidate.id)}
                        className="me-2"
                      >
                        Edit
                      </Button>
                      <Button
                        variant="outline-danger"
                        size="sm"
                        onClick={() => handleDelete(candidate.id)}
                      >
                        Delete
                      </Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </Table>
        </Col>
      </Row>

      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>{editId ? 'Edit Candidate' : 'Add Candidate'}</Modal.Title>
        </Modal.Header>
        <Form noValidate validated={validated} onSubmit={handleSubmit}>
          <Modal.Body>
            <Form.Group className="mb-3" controlId="firstName">
              <Form.Label>First Name</Form.Label>
              <Form.Control
                type="text"
                required
                value={formData.firstName}
                onChange={(e) =>
                  setFormData({ ...formData, firstName: e.target.value })
                }
              />
              <Form.Control.Feedback type="invalid">
                Please enter the first name.
              </Form.Control.Feedback>
            </Form.Group>
            <Form.Group className="mb-3" controlId="lastName">
              <Form.Label>Last Name</Form.Label>
              <Form.Control
                type="text"
                required
                value={formData.lastName}
                onChange={(e) =>
                  setFormData({ ...formData, lastName: e.target.value })
                }
              />
              <Form.Control.Feedback type="invalid">
                Please enter the last name.
              </Form.Control.Feedback>
            </Form.Group>
            <Form.Group className="mb-3" controlId="position">
              <Form.Label>Position</Form.Label>
              <Form.Select
                required
                value={formData.position}
                onChange={(e) =>
                  setFormData({ ...formData, position: e.target.value })
                }
              >
                <option value="" disabled>
                  Select a position
                </option>
                {positions.map((pos) => (
                  <option key={pos} value={pos}>
                    {pos}
                  </option>
                ))}
              </Form.Select>
              <Form.Control.Feedback type="invalid">
                Please select a position.
              </Form.Control.Feedback>
            </Form.Group>
            <Form.Group className="mb-3" controlId="platform">
              <Form.Label>Platform</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                required
                value={formData.platform}
                onChange={(e) =>
                  setFormData({ ...formData, platform: e.target.value })
                }
              />
              <Form.Control.Feedback type="invalid">
                Please enter the platform or manifesto.
              </Form.Control.Feedback>
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowModal(false)}>
              Cancel
            </Button>
            <Button variant="primary" type="submit">
              Save
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </Container>
  );
};

export default CandidatesPage;
