import React, { useState, useEffect } from 'react';
import { API_BASE } from '../api/auth';

const NoteForm = ({ setNotes }) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState(null);

  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => setMessage(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (title.trim() === '' || content.trim() === '') {
      setMessage({ type: 'error', text: 'Title and content cannot be empty.' });
      return;
    }

    setIsSubmitting(true);
    setMessage(null);

    try {
      const res = await fetch(`${API_BASE}/notes`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({
          title: title.trim(),
          content: content.trim(),
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to add note');

      setNotes(prev => [data, ...prev]); // show newest on top
      setTitle('');
      setContent('');
      setMessage({ type: 'success', text: '📝 Note added successfully!' });
    } catch (err) {
      setMessage({ type: 'error', text: `❌ ${err.message}` });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="card shadow-sm mb-4 border-0">
      <a href="#all-notes" id="card-body"></a>
      <p href="#all-notes" id="notes" className='m-0 p-0'></p>
      <div className="card-body" >
        <h5 className="card-title mb-3">Create a New Note</h5>

        {message && (
          <div className={`alert alert-${message.type === 'error' ? 'danger' : 'success'} alert-dismissible fade show`} role="alert">
            {message.text}
            <button type="button" className="btn-close" onClick={() => setMessage(null)}></button>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <fieldset disabled={isSubmitting}>
            <div className="mb-3">
              <label className="form-label fw-semibold">Title</label>
              <input
                type="text"
                className="form-control"
                placeholder="Title"
                value={title}
                onChange={e => setTitle(e.target.value)}
              />
            </div>
            <div className="mb-3">
              <label className="form-label fw-semibold">Content</label>
              <textarea
                className="form-control"
                rows="4"
                placeholder="Write your thoughts here..."
                value={content}
                onChange={e => setContent(e.target.value)}
              />
            </div>
            <div className="d-grid">
              <button className="btn btn-primary" type="submit">
                {isSubmitting ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                    Saving...
                  </>
                ) : (
                  'Add Note'
                )}
              </button>
            </div>
          </fieldset>
        </form>
      </div>
    </div>
  );
};

export default NoteForm;
