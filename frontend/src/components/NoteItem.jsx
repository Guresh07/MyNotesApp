import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import ShareModal from './ShareModal';
import jsPDF from 'jspdf';
import { API_BASE } from '../api/auth';

const NoteItem = ({ note, handleDelete }) => {
  const [showModal, setShowModal] = useState(false);

  const handleDownloadPDF = () => {
    try {
      if (!note || !note.title || !note.content) {
        throw new Error("Note data is incomplete or missing");
      }

      if (!note.isPublic) {
        alert("PDF download is not allowed for private notes.");
        return;
      }

      const doc = new jsPDF();
      doc.setFontSize(16);
      doc.text(`Title: ${note.title}`, 10, 20);
      doc.setFontSize(12);
      doc.text(note.content, 10, 40);
      doc.save(`${note.title.replace(/[^a-zA-Z0-9]/g, '_')}.pdf`);
    } catch (err) {
      alert("PDF Download failed: " + err.message);
    }
  };


  const handleDownloadTxt = async () => {
    try {
      const response = await fetch(`${API_BASE}/notes/${note._id}/download`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (!response.ok) throw new Error("Download failed");

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;
      a.download = `${note.title}.txt`;
      document.body.appendChild(a);
      a.click();
      a.remove();

      window.URL.revokeObjectURL(url);
    } catch (err) {
      alert("Download failed: " + err.message);
    }
  };

  const handleDropdownSelect = (e) => {
    const value = e.target.value;
    if (value === "txt") handleDownloadTxt();
    else if (value === "pdf") handleDownloadPDF();
  };

  return (
    <>
      <li className="list-group-item shadow-sm border-0 rounded-3 my-2 p-3 note-item-hover">
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center">

          {/* Left: Title & Tags */}
          <div className="mb-3 mb-md-0">
            <p className="fw-bold fs-5 text-primary m-0">{note.title}</p>
            {note.tags && note.tags.length > 0 && (
              <div className="mt-2">
                {note.tags.map((tag, index) => (
                  <span key={index} className="badge bg-gradient bg-secondary me-2 mb-1">
                    #{tag}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Right: Buttons */}
          <div className="d-flex flex-wrap align-items-center gap-2">
            <Link to={`/note/${note._id}`} className="btn btn-sm btn-outline-info">
              <i className="bi bi-eye"></i> View
            </Link>
            <Link to={`/edit/${note._id}`} className="btn btn-sm btn-outline-warning">
              <i className="bi bi-pencil"></i> Edit
            </Link>
            <button
              className="btn btn-sm btn-outline-danger"
              onClick={() => handleDelete(note._id)}
            >
              <i className="bi bi-trash"></i> Delete
            </button>
            <button
              className="btn btn-sm btn-outline-secondary"
              onClick={() => setShowModal(true)}
              title="Share"
            >
              <i className="bi bi-share"></i> Share
            </button>

            <select
              className="form-select form-select-sm w-auto  fw-semibold"
              onChange={handleDropdownSelect}
              defaultValue=""
              title="Download your note"
            >
              <option value="" disabled>⬇️ Download as...</option>
              <option value="txt">📄 Text (.txt)</option>
              <option value="pdf">🧾 PDF (.pdf)</option>
            </select>


          </div>
        </div>

        <ShareModal show={showModal} handleClose={() => setShowModal(false)} noteId={note._id} />
      </li>
    </>
  );
};

export default NoteItem;
