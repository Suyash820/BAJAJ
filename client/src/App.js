import React, { useState } from 'react';
import axios from 'axios';
import './App.css';
import ResultDisplay from './components/ResultDisplay';
import InputForm from './components/InputForm';

function App() {
  const [input, setInput] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setResult(null);

    try {
      setLoading(true);
      const entries = input
        .split('\n')
        .map(line => line.trim())
        .filter(line => line.length > 0);

      const response = await axios.post('/bfhl', { data: entries });
      setResult(response.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Error processing graph. Please check your input.');
      console.error('API Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    setInput('');
    setResult(null);
    setError('');
  };

  return (
    <div className="wrapper">
      {/* Background effects */}
      <div className="glow-orb a"></div>
      <div className="glow-orb b"></div>

      {/* Header */}
      <header>
        <div className="badge">GRAPH EXPLORER</div>
        <h1>BFHL <span>Node Graph</span> Explorer</h1>
        <p className="subtitle">Parse, validate, and analyze hierarchical node structures</p>
      </header>

      {/* Main content */}
      <div className="container">
        <InputForm 
          input={input} 
          onInputChange={setInput}
          onSubmit={handleSubmit}
          onClear={handleClear}
          loading={loading}
          error={error}
        />
        
        {result && <ResultDisplay data={result} />}
      </div>

      <footer className="footer">
        <p>BFHL Node Graph Explorer v1.0</p>
      </footer>
    </div>
  );
}

export default App;
