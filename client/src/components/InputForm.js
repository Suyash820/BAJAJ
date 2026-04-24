import React from 'react';

export default function InputForm({
  input,
  onInputChange,
  onSubmit,
  onClear,
  loading,
  error
}) {
  return (
    <div className="card">
      <div className="card-label">Input Edges</div>
      <p className="description">
        Enter graph edges one per line (format: <code>A-&gt;B</code>)
      </p>
      
      <textarea
        className={error ? 'error' : ''}
        value={input}
        onChange={(e) => onInputChange(e.target.value)}
        placeholder="A->B&#10;B->C&#10;A->C"
      />

      {error && <div className="error-message">{error}</div>}

      <div className="button-group">
        <button 
          className="btn btn-primary" 
          onClick={onSubmit}
          disabled={loading || !input.trim()}
        >
          {loading ? 'Processing...' : 'Analyze'}
        </button>
        <button 
          className="btn btn-secondary" 
          onClick={onClear}
          disabled={loading}
        >
          Clear
        </button>
      </div>
    </div>
  );
}
