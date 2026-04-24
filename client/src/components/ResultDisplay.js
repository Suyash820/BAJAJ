import React, { useState } from 'react';

export default function ResultDisplay({ data }) {
  const [expandedHierarchy, setExpandedHierarchy] = useState(null);

  const toggleHierarchy = (idx) => {
    setExpandedHierarchy(expandedHierarchy === idx ? null : idx);
  };

  return (
    <div className="results-section">
      {/* User Info */}
      <div className="card">
        <div className="card-label">User Information</div>
        <div className="info-grid">
          <div className="info-item">
            <span className="label">User ID:</span>
            <code>{data.user_id}</code>
          </div>
          <div className="info-item">
            <span className="label">Email:</span>
            <code>{data.email_id}</code>
          </div>
          <div className="info-item">
            <span className="label">Roll Number:</span>
            <code>{data.college_roll_number}</code>
          </div>
        </div>
      </div>

      {/* Summary */}
      <div className="card">
        <div className="card-label">Summary</div>
        <div className="summary-grid">
          <div className="stat">
            <div className="stat-label">Total Trees</div>
            <div className="stat-value">{data.summary.total_trees}</div>
          </div>
          <div className="stat">
            <div className="stat-label">Total Cycles</div>
            <div className="stat-value">{data.summary.total_cycles}</div>
          </div>
          <div className="stat">
            <div className="stat-label">Largest Tree Root</div>
            <div className="stat-value">{data.summary.largest_tree_root || 'N/A'}</div>
          </div>
        </div>
      </div>

      {/* Invalid & Duplicates */}
      {(data.invalid_entries?.length > 0 || data.duplicate_edges?.length > 0) && (
        <div className="card warning">
          <div className="card-label">Warnings</div>
          {data.invalid_entries?.length > 0 && (
            <div className="warning-section">
              <h4>Invalid Entries ({data.invalid_entries.length})</h4>
              <div className="entries-list">
                {data.invalid_entries.map((entry, idx) => (
                  <code key={idx} className="invalid">{entry}</code>
                ))}
              </div>
            </div>
          )}
          {data.duplicate_edges?.length > 0 && (
            <div className="warning-section">
              <h4>Duplicate Edges ({data.duplicate_edges.length})</h4>
              <div className="entries-list">
                {data.duplicate_edges.map((edge, idx) => (
                  <code key={idx} className="duplicate">{edge}</code>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Hierarchies */}
      <div className="card">
        <div className="card-label">Hierarchies ({data.hierarchies?.length})</div>
        {data.hierarchies?.length === 0 ? (
          <p className="muted">No valid hierarchies found.</p>
        ) : (
          data.hierarchies.map((h, idx) => (
            <div key={idx} className="hierarchy-item">
              <button
                className="hierarchy-header"
                onClick={() => toggleHierarchy(idx)}
              >
                <span className="chevron">{expandedHierarchy === idx ? '▼' : '▶'}</span>
                <span className="root-badge">{h.root}</span>
                {h.has_cycle && <span className="cycle-badge">CYCLE</span>}
                {!h.has_cycle && h.depth && <span className="depth-badge">Depth: {h.depth}</span>}
              </button>
              
              {expandedHierarchy === idx && (
                <div className="hierarchy-content">
                  <pre>{JSON.stringify(h.tree, null, 2)}</pre>
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* Raw JSON */}
      <div className="card">
        <div className="card-label">Raw Response</div>
        <pre className="json-output">{JSON.stringify(data, null, 2)}</pre>
      </div>
    </div>
  );
}
