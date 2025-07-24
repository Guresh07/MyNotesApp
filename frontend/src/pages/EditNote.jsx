import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { API_BASE } from '../api/auth';

const EditNote = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [note, setNote] = useState({ title: '', content: '', isPublic: false });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API_BASE}/notes/${id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setNote({
          title: data.title,
          content: data.content,
          isPublic: data.isPublic ?? false,
        });
        setLoading(false);
      })
      .catch((err) => {
        console.error('Failed to fetch note:', err);
        setLoading(false);
      });
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNote((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API_BASE}/notes/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(note),
      });

      if (!res.ok) throw new Error('Failed to update note');

      navigate('/');
    } catch (err) {
      console.error('Error updating note:', err.message);
    }
  };

  if (loading)
    return (
      <div className="d-flex justify-content-center align-items-center mt-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );

  return (
    <div className="col-12 col-sm-10 mt-4">
      <div className="card shadow p-4">
        <h2 className="mb-4 text-primary">✏️ Edit Note</h2>

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label fw-semibold">Title</label>
            <input
              type="text"
              name="title"
              value={note.title}
              onChange={handleChange}
              className="form-control"
              required
              placeholder="Enter your note title"
            />
          </div>

          <div className="mb-3">
            <label className="form-label fw-semibold">Content</label>
            <textarea
              name="content"
              value={note.content}
              onChange={handleChange}
              className="form-control"
              rows="5"
              required
              placeholder="Write your content here..."
            ></textarea>
          </div>

          <div className="form-check form-switch mb-4">
            <input
              className="form-check-input"
              type="checkbox"
              id="isPublic"
              checked={note.isPublic}
              onChange={(e) =>
                setNote((prev) => ({ ...prev, isPublic: e.target.checked }))
              }
            />
            <label className="form-check-label fw-medium" htmlFor="isPublic">
              🌐 Make this note public
            </label>
          </div>

          <button type="submit" className="btn btn-success w-100 fw-bold">
            ✅ Update Note
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditNote;
