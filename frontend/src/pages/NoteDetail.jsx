import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { API_BASE } from '../api/auth';

const NoteDetail = () => {
  const { id } = useParams();
  const [note, setNote] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    fetch(`${API_BASE}/notes/${id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then(res => {
        if (!res.ok) throw new Error('Note not found');
        return res.json();
      })
      .then(data => setNote(data))
      .catch(err => setError(err.message));
  }, [id]);

  if (error) {
    return (
      <div className="container mt-4 col-12 col-sm-10">
        <div className="alert alert-danger" role="alert">
          <h5 className="alert-heading">Error</h5>
          <p>{error}</p>
          <hr />
          <Link to="/" className="btn btn-outline-secondary">⬅️ Back to Home</Link>
        </div>
      </div>
    );
  }

  if (!note) {
    return (
      <div className="container mt-4 text-center">
        <div className="spinner-border text-primary" role="status"></div>
        <p className="mt-3">Loading note details...</p>
      </div>
    );
  }

  return (
    <div className="container mt-4 col-12 col-sm-10">
      <div className="card shadow-sm border-0">
        <div className="card-body">
          <h2 className="card-title">{note.title}</h2>
          <div
            className="card-text mt-3"
            style={{
              maxHeight: '280px',
              overflowY: 'auto',
              paddingRight: '10px',
              whiteSpace: 'pre-wrap',
              scrollbarWidth: 'none',       // Firefox
              msOverflowStyle: 'none',      // IE/Edge
            }}
          >
            <div
              style={{
                overflow: 'hidden',
                paddingRight: '10px',
              }}
            >
              {note.content}
            </div>
          </div>

          <hr />
          <p className=" mb-1">
            <strong>🕒 Created:</strong> {new Date(note.createdAt).toLocaleString()}
          </p>
          {note.updatedAt && (
            <p className="">
              <strong>✏️ Updated:</strong> {new Date(note.updatedAt).toLocaleString()}
            </p>
          )}
          <Link to="/" className="btn btn-primary mt-3">⬅️ Back to All Notes</Link>
        </div>
      </div>
    </div>
  );
};

export default NoteDetail;
