import React from 'react';
import NoteItem from './NoteItem';
// import '; // import the CSS file

const NoteList = ({ notes, handleDelete }) => {
  if (notes.length === 0) {
    return <p>No notes found.</p>;
  }

  return (
    <div className="note-list-scroll-container p-0">
      <ul className="list-group">
        {notes.map(note => (
          <NoteItem key={note._id} note={note} handleDelete={handleDelete} />
        ))}
      </ul>
    </div>
  );
};

export default NoteList;
