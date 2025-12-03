import { useState, useEffect } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';

export default function NotImplementedModal(
  { message, setHidden }: { message: string; setHidden: Function; }
) {
  const [show, setShow] = useState(false);

  useEffect(() => { setTimeout(() => setShow(true), 200); }, []);

  const handleClose = () => {
    setShow(false);
    setTimeout(() => setHidden(), 300);
  };

  return (
    <>
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Not implemented yet...</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {message}
          <i className="ps-3 bi bi-emoji-frown-fill"></i>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={handleClose}>
            OK
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}