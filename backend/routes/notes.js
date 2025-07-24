
import express from 'express';
import Note from '../models/Note.js';
import verifyToken from '../middleware/authMiddleware.js';

const router = express.Router();

// 📌 CREATE a note (protected)
router.post('/', verifyToken, async (req, res) => {
  try {
    const { title, content, tags } = req.body;

    if (!title || !content) {
      return res.status(400).json({ error: 'Title and content are required' });
    }

    const newNote = new Note({
      title,
      content,
      tags,
      user: req.user.userId // associate note with user
    });

    await newNote.save();
    res.status(201).json(newNote);
  } catch (err) {
    console.error('Create Note Error:', err.message);
    res.status(500).json({ error: 'Server error' });
  }
});

// 📌 READ all notes of the authenticated user
router.get('/', verifyToken, async (req, res) => {
  try {
    const notes = await Note.find({ user: req.user.userId }).sort({ createdAt: -1 });
    res.json(notes);
  } catch (err) {
    console.error('Fetch Notes Error:', err.message);
    res.status(500).json({ error: 'Server error' });
  }
});

// 📌 GET single note by ID (must belong to user)
router.get('/:id', verifyToken, async (req, res) => {
  try {
    const note = await Note.findOne({ _id: req.params.id, user: req.user.userId });
    if (!note) return res.status(404).json({ error: 'Note not found' });
    res.json(note);
  } catch (err) {
    console.error('Fetch Note Error:', err.message);
    res.status(500).json({ error: 'Server error' });
  }
});

// 📌 UPDATE a note
router.put('/:id', verifyToken, async (req, res) => {
  try {
    const { title, content, tags, isPublic } = req.body;

    const updatedNote = await Note.findOneAndUpdate(
      { _id: req.params.id, user: req.user.userId },
      { title, content, tags, isPublic, updatedAt: Date.now() },
      { new: true }
    );

    if (!updatedNote) return res.status(404).json({ error: 'Note not found' });
    res.json(updatedNote);
  } catch (err) {
    console.error('Update Note Error:', err.message);
    res.status(500).json({ error: 'Server error' });
  }
});

// 📌 DELETE a note
router.delete('/:id', verifyToken, async (req, res) => {
  try {
    const deletedNote = await Note.findOneAndDelete({ _id: req.params.id, user: req.user.userId });
    if (!deletedNote) return res.status(404).json({ error: 'Note not found' });
    res.json({ message: 'Note deleted', deletedNote });
  } catch (err) {
    console.error('Delete Note Error:', err.message);
    res.status(500).json({ error: 'Server error' });
  }
});

// 📌 DOWNLOAD NOTE AS TXT FILE
// ✅ Public download route
router.get('/:id/download', async (req, res) => {
  try {
    const note = await Note.findById(req.params.id);
    // ✅ Only allow public notes to be downloaded
    if (!note || !note.isPublic) {
      return res.status(404).json({ error: 'Note not found or not public' });
    }
    const filename = `${note.title.replace(/[^a-zA-Z0-9]/g, '_')}.txt`;
    const content = `Title: ${note.title}\n\n${note.content}`;

    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    res.setHeader('Content-Type', 'text/plain');
    res.send(content);
  } catch (err) {
    console.error('Download Note Error:', err.message);
    res.status(500).json({ error: 'Server error' });
  }
});




export default router;











// import express from 'express';
// import { readNotes, writeNotes } from '../utils/fileUtils.js';


// const router = express.Router();

// router.post('/', async (req, res) => {

//     try {
//         const { title, content } = req.body;

//         if (!title || !content) {
//             return res.status(400).json({ error: "title and content are required" });
//         }

//         // 2. Read existing notes from the file
//         const notes = await readNotes();

//         const newNote = {
//             id: Date.now(),
//             title,
//             content,
//             createdAt: new Date().toISOString(),
//         };


//         notes.push(newNote);

//         await writeNotes(notes);

//         res.status(201).json(newNote);


//     } catch (error) {
//         console.error('Error creating note:', error.message);
//         res.status(500).json({ error: 'Server error' });
//     }


// });

// router.get('/', async (req, res) => {
//     try {
//         const notes = await readNotes();
//         res.json(notes)
//     } catch (error) {
//         console.error('error fetching notes:', error.message);
//         res.status(500).json({ error: 'server error' })
//     }
// });

// router.get('/:id', async (req, res) => {

//     try {
//         const notes = await readNotes();
//         const noteId = parseInt(req.params.id);
//         const note = notes.find(n => n.id === noteId);

//         if (!note) {
//             return res.status(404).json({ error: 'Note not found' });
//         }

//         res.json(note)
//     } catch (error) {
//         console.error('error fetching note:', error.message);
//         res.status(500).json({ error: 'server error' });
//     }
// });

// router.put('/:id', async (req, res) => {

//     try {
//         const noteId = parseInt(req.params.id);
//         const { title, content } = req.body;

//         const notes = await readNotes();

//         const noteIndex = notes.findIndex(n => n.id === noteId);

//         if (noteIndex === -1) {
//             return res.status(400).json({ error: 'Note not Found' })
//         }

//         if (!title && !content) {
//             return res.status(400).json({ error: 'Nothing to update. Provide title or content.' });
//         }

//         if (title) notes[noteIndex].title = title;
//         if (content) notes[noteIndex].content = content;
//         notes[noteIndex].updatedAt = new Date().toISOString();

//         await writeNotes(notes)

//         res.json(notes[noteIndex]);


//     } catch (error) {

//         console.error('Error updating note:', error.message);
//         res.status(500).json({ error: 'Server error' });
//     }

// });

// router.delete('/:id', async (req, res) => {


//     try {
//         const noteId = parseInt(req.params.id);

//         const notes = await readNotes()

//         const noteIndex = notes.findIndex(n => n.id === noteId);

//         if (noteIndex === -1) {
//             return res.status(404).json({ error: 'Note note found' })
//         }


//         const deletedNote = notes.splice(noteIndex, 1)[0];

//         await writeNotes(notes);

//         res.json({ message: 'Note deleted successfully', deletedNote })
//     } catch (error) {
//         console.error('Error deleting note:', error.message);
//         res.status(500).json({ error: 'Server error' });
//     }
// });

// router.get('/:id/download', async (req, res) => {
//     try {
//         const notes = await readNotes();
//         const noteId = parseInt(req.params.id);
//         const note = notes.find(n => n.id === noteId);

//         if (!note) {
//             return res.status(404).json({ error: 'Note not found' });
//         }

//         const fileName = `${note.title.replace(/\s+/g, '_')}.txt`;
//         const content = `Title: ${note.title}\n\nContent:\n${note.content}`;

//         res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`);
//         res.setHeader('Content-Type', 'text/plain');

//         res.send(content);
//     } catch (error) {
//         console.error('Error downloading note:', error.message);
//         res.status(500).json({ error: 'Server error' });
//     }
// });

// export default router;


