import React, { useEffect, useState } from 'react';
import {
  Container,
  Button,
  Table,
  Modal,
  Form
} from 'react-bootstrap';
import { v4 as uuidv4 } from 'uuid';
import './App.css'; 

interface Position {
  id: string;
  name: string;
  voteLimit: number;
}

const STORAGE_KEY = 'voting-positions';

const PositionManager: React.FC = () => {
  const [positions, setPositions] = useState<Position[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [name, setName] = useState('');
  const [voteLimit, setVoteLimit] = useState(1);
  const [errors, setErrors] = useState<{ name?: string; voteLimit?: string }>({});

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      setPositions(JSON.parse(stored));
    } else {
      const initialPositions: Position[] = [
        'President', 'Vice', 'Secretary', 'Auditor', 'Treasurer',
        'PIO in', 'PIO ex', 'Senator 1', 'Senator 2', 'Senator 3',
        'Senator 4', 'Senator 5', 'Senator 6', 'Senator 7', 'Senator 8'
      ].map(title => ({ id: uuidv4(), name: title, voteLimit: 1 }));
      localStorage.setItem(STORAGE_KEY, JSON.stringify(initialPositions));
      setPositions(initialPositions);
    }
  }, []);

  const savePositions = (updated: Position[]) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    setPositions(updated);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    let valid = true;
    const newErrors: typeof errors = {};

    if (!name.trim()) {
      newErrors.name = 'Position name is required';
      valid = false;
    } else if (
      positions.some(
        pos => pos.name.toLowerCase() === name.trim().toLowerCase() && pos.id !== editId
      )
    ) {
      newErrors.name = 'Position name must be unique';
      valid = false;
    }

    if (voteLimit < 1) {
      newErrors.voteLimit = 'Vote limit must be at least 1';
      valid = false;
    }

    setErrors(newErrors);
    if (!valid) return;

    const updatedPositions = editId
      ? positions.map(pos =>
          pos.id === editId ? { ...pos, name: name.trim(), voteLimit } : pos
        )
      : [...positions, { id: uuidv4(), name: name.trim(), voteLimit }];

    savePositions(updatedPositions);
    setShowModal(false);
    resetForm();
  };

  const handleEdit = (id: string) => {
    const pos = positions.find(p => p.id === id);
    if (pos) {
      setEditId(id);
      setName(pos.name);
      setVoteLimit(pos.voteLimit);
      setShowModal(true);
    }
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this position?')) {
      const updated = positions.filter(p => p.id !== id);
      savePositions(updated);
    }
  };

  const resetForm = () => {
    setEditId(null);
    setName('');
    setVoteLimit(1);
    setErrors({});
  };

  return (
    <Container fluid className="p-4 bg-light min-vh-100">
      <h2 className="text-dark fw-bold">Position List</h2>
      <p className="text">Manage positions and set vote limits per position.</p>

      <Button className="btn-custom-blue mb-3" onClick={() => {
        resetForm();
        setShowModal(true);
      }}>
        Add New
      </Button>

      <Table bordered hover responsive className="bg-white rounded">
        <thead className="table-header-custom">
          <tr>
            <th>Position</th>
            <th>Vote Limit</th>
            <th style={{ width: '130px' }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {positions.length > 0 ? (
            positions.map(pos => (
              <tr key={pos.id}>
                <td>{pos.name}</td>
                <td>{pos.voteLimit}</td>
                <td>
                  <Button
                    variant="warning"
                    size="sm"
                    onClick={() => handleEdit(pos.id)}
                    className="me-2"
                  >
                    Edit
                  </Button>
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => handleDelete(pos.id)}
                  >
                    Delete
                  </Button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={3} className="text-center">No positions available.</td>
            </tr>
          )}
        </tbody>
      </Table>

      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>{editId ? 'Edit Position' : 'Add Position'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit} noValidate>
            <Form.Group className="mb-3">
              <Form.Label>Position Name *</Form.Label>
              <Form.Control
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                isInvalid={!!errors.name}
              />
              <Form.Control.Feedback type="invalid">{errors.name}</Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Vote Limit *</Form.Label>
              <Form.Control
                type="number"
                min={1}
                value={voteLimit}
                onChange={e => setVoteLimit(parseInt(e.target.value))}
                isInvalid={!!errors.voteLimit}
              />
              <Form.Control.Feedback type="invalid">{errors.voteLimit}</Form.Control.Feedback>
            </Form.Group>

            <Button type="submit" className="btn-custom-blue w-100">
              Save
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </Container>
  );
};

export default PositionManager;
