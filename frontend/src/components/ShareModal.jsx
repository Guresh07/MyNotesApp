// components/ShareModal.jsx
import React from 'react';
import { Modal, Button } from 'react-bootstrap';
import { toast } from 'react-toastify';
import { QRCodeCanvas } from 'qrcode.react';
import { API_BASE } from '../api/auth';

const ShareModal = ({ show, handleClose, noteId }) => {


    const downloadURL = `${API_BASE}/notes/${noteId}/download`;

    const handleCopyLink = () => {
        const downloadURL = `${API_BASE}/notes/${noteId}/download`;

        navigator.clipboard.writeText(downloadURL)
            .then(() => {
                toast.success("Link copied to clipboard!");
            })
            .catch(err => {
                toast.error("Failed to copy link.");
                console.error("Clipboard error:", err);
            });
    };



    return (
        <Modal  show={show} onHide={handleClose} centered>
            <Modal.Header closeButton>
                <Modal.Title>Share Note</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <p className="mb-2">Copy the link below to share your note:</p>
                <input
                    type="text"
                    className="form-control mb-3"
                    value={downloadURL}
                    readOnly
                    onClick={(e) => e.target.select()}
                />
                <div className="text-center mb-3">
                    <QRCodeCanvas value={downloadURL} size={150} />
                    <p className="text-muted small mt-2">Scan QR to download</p>
                </div>
                <div className="d-flex justify-content-end">
                    <Button variant="secondary" className="me-2" onClick={handleClose}>
                        Close
                    </Button>
                    <Button className='me-2' variant="primary" onClick={handleCopyLink}>
                        Copy Link
                    </Button>
                </div>
            </Modal.Body>
        </Modal>
    );
};

export default ShareModal;
