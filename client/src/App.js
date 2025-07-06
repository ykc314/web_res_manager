import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import BookingManagementSystem from './components/BookingManagementSystem';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<BookingManagementSystem />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;