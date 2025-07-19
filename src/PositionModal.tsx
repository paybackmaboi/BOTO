// PositionModal.tsx
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import { useEffect, useState } from 'react';

// Define the Position type if not already defined elsewhere
type Position = {
    id?: number;
    name: string;
    voteLimit: number;
};

// This is a placeholder hook. You will need to implement this based on your state management solution.
const useData = () => ({
  savePosition: (position: Partial<Position>) => {
    console.log("Saving position:", position);
    // Here you would typically have logic to save to localStorage, an API, etc.
  }
});

const PositionModal: React.FC<{ show: boolean, handleClose: () => void, position: Partial<Position> | null }> = ({ show, handleClose, position }) => {
    const { savePosition } = useData();
    const [formData, setFormData] = useState<Partial<Position>>({});

    useEffect(() => {
        setFormData(position || { name: '', voteLimit: 1 });
    }, [position]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, type } = e.target;
        setFormData(prev => ({ ...prev, [name]: type === 'number' ? parseInt(value, 10) : value }));
    };

    const onSave = () => {
        if (!formData.name) {
            alert("Position name is required.");
            return;
        }
        savePosition(formData);
        handleClose();
    };

    return (
        <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton>
                <Modal.Title>{position?.id ? 'Edit' : 'Add'} Position</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form>
                    <Form.Group className="mb-3">
                        <Form.Label>Position Name</Form.Label>
                        <Form.Control type="text" name="name" value={formData.name || ''} onChange={handleChange} />
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label>Vote Limit</Form.Label>
                        <Form.Control type="number" name="voteLimit" min="1" value={formData.voteLimit || 1} onChange={handleChange} />
                    </Form.Group>
                </Form>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>Close</Button>
                <Button variant="primary" onClick={onSave}>Save Changes</Button>
            </Modal.Footer>
        </Modal>
    );
};
export default PositionModal;