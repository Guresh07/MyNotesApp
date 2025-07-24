import React, { useEffect, useState } from 'react';
import NoteForm from '../components/NoteForm';
import NoteList from '../components/NoteList';
import { API_BASE } from '../api/auth';


function Home() {
  const [notes, setNotes] = useState([]);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOption, setSortOption] = useState('latest');

  const fetchNotes = async () => {
    try {
      const token = localStorage.getItem("token"); // token stored after login
      const res = await fetch(`${API_BASE}/notes`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.status === 401) {
        throw new Error("Unauthorized. Please login again.");
      }

      const data = await res.json();
      setNotes(data);
    } catch (err) {
      setError("Failed to fetch notes: " + err.message);
      console.error("Fetch error:", err);
    }
  };


  const handleDelete = async (id) => {
    try {
      // const token = localStorage.getItem("token"); // token stored after login
      const res = await fetch(`${API_BASE}/notes/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (!res.ok) throw new Error('Failed to delete');
      fetchNotes(); // Refresh list
    } catch (err) {
      alert('Error deleting note: ' + err.message);
    }
  };

  useEffect(() => {
    fetchNotes();
  }, []);

  const filteredNotes = notes
    .filter(note =>
      note.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      note.content.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      switch (sortOption) {
        case 'latest':
          return new Date(b.createdAt) - new Date(a.createdAt);
        case 'oldest':
          return new Date(a.createdAt) - new Date(b.createdAt);
        case 'az':
          return a.title.localeCompare(b.title);
        case 'za':
          return b.title.localeCompare(a.title);
        default:
          return 0;
      }
    });

  return (

    <div className="col-12 col-sm-10 mt-4 position-relative">
      <NoteForm setNotes={setNotes} />

      {error && <div className="alert alert-danger">{error}</div>}

      <div className="mt-5 d-flex flex-wrap justify-content-between align-items-center" >
        <h2 className='' id="all-notes">All Notes</h2>
        <div className="d-flex align-items-center gap-2">
          <label className="form-label mb-0 fw-bold">Sort:</label>
          <select
            value={sortOption}
            onChange={(e) => setSortOption(e.target.value)}
            className="form-select form-select-sm w-auto"
          >
            <option value="latest">🕐 Latest First</option>
            <option value="oldest">📜 Oldest First</option>
            <option value="az">🔤 A-Z</option>
            <option value="za">🔠 Z-A</option>
          </select>
        </div>

      </div>

      <div className="input-group my-3">
        <span className="input-group-text">🔍</span>
        <input
          type="text"
          className="form-control"
          placeholder="Search notes by title or content..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>


      <div className="mt-4 border-black rounded">
        {filteredNotes.length === 0 ? (
          <div className="alert alert-warning">No matching notes found.</div>
        ) : (
          <NoteList notes={filteredNotes} handleDelete={handleDelete} />
        )}
      </div>
    </div>
  );
}

export default Home;
