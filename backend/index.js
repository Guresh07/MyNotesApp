// index.js


import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import cors from 'cors';
import connectDB from './config/db.js';   // <-- MongoDB connection
import notesRouter from './routes/notes.js';
import authRoutes from './routes/auth.js';

// 1. Connect to MongoDB
connectDB();  // This will initiate the DB connection

const app = express();
const PORT = process.env.PORT;

app.use(cors());
app.use(express.json());

// Routes
app.use(process.env.AUTH_ROUTES, authRoutes);
app.use(process.env.NOTES_ROUTER, notesRouter);

app.get('/', (req, res) => {
  res.send('Welcome to the Notes API!');
});

app.listen(PORT, '0.0.0.0' , () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
