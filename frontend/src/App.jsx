// App.jsx
import React from 'react';
import { BrowserRouter, Routes, Route, useNavigate } from 'react-router-dom';
import Home from './pages/Home';
import NoteDetail from './pages/NoteDetail';
import EditNote from './pages/EditNote';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './App.css';
import Login from './components/Login';
import Register from './components/Register';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import { useAuth } from "./context/AuthContext";
import { Navigate } from "react-router-dom";
import { useTheme } from './context/ThemeContext';


function App() {
  const { user, loading } = useAuth();
  const { theme, toggleTheme } = useTheme();


  if (loading) return (
    <div className="d-flex justify-content-center align-items-center vh-100">
      <div className="spinner-border text-primary" role="status"></div>
    </div>
  );


  return (
    <>
      <div>
        <BrowserRouter>
          <div className="container d-flex flex-column align-items-center justify-content-center py-4">
            <Navbar />
            

            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <>
                {/* Protected Routes */}
                <Route
                  path="/"
                  element={
                    <ProtectedRoute>
                      <Home />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/note/:id"
                  element={
                    <ProtectedRoute>
                      <NoteDetail />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/edit/:id"
                  element={
                    <ProtectedRoute>
                      <EditNote />
                    </ProtectedRoute>
                  }
                />
              </>
            </Routes>

            <ToastContainer position="top-center" autoClose={1500} />
          </div>
        </BrowserRouter>
        <div className='theme-toggle-btn m-0 p-0'>
        <a href="#" className='goToTop'></a>
          <button onClick={toggleTheme} className="btn btn-secondary btn-sm">
            {theme === 'dark' ? '☀️' : '🌙'}
          </button>
        </div>
      </div>
    </>
  );
}

export default App;
