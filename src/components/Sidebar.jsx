import { useState, useRef, useEffect, useCallback } from 'react';
import './Sidebar.css';

export default function Sidebar({
  open,
  onClose,
  canvases,
  activeCanvasId,
  onSwitch,
  onNew,
  onRename,
  onDelete,
  onDuplicate,
}) {
  const [renamingId, setRenamingId] = useState(null);
  const [renameValue, setRenameValue] = useState('');
  const renameInputRef = useRef(null);

  useEffect(() => {
    if (renamingId && renameInputRef.current) {
      renameInputRef.current.focus();
      renameInputRef.current.select();
    }
  }, [renamingId]);

  const startRename = useCallback((e, canvas) => {
    e.stopPropagation();
    setRenamingId(canvas.id);
    setRenameValue(canvas.title);
  }, []);

  const commitRename = useCallback(() => {
    if (renamingId && renameValue.trim()) {
      onRename(renamingId, renameValue.trim());
    }
    setRenamingId(null);
  }, [renamingId, renameValue, onRename]);

  const handleRenameKeyDown = useCallback((e) => {
    if (e.key === 'Enter') commitRename();
    if (e.key === 'Escape') setRenamingId(null);
  }, [commitRename]);

  const handleSwitch = useCallback((id) => {
    onSwitch(id);
    // Close sidebar on mobile
    if (window.innerWidth < 1024) onClose();
  }, [onSwitch, onClose]);

  const handleNew = useCallback(() => {
    onNew();
    if (window.innerWidth < 1024) onClose();
  }, [onNew, onClose]);

  const handleDelete = useCallback((e, id) => {
    e.stopPropagation();
    if (canvases.length <= 1) return;
    onDelete(id);
  }, [canvases.length, onDelete]);

  const handleDuplicate = useCallback((e, id) => {
    e.stopPropagation();
    onDuplicate(id);
  }, [onDuplicate]);

  return (
    <aside className={`sidebar ${open ? 'open' : ''}`}>
      <div className="sidebar-backdrop" onClick={onClose} />
      <div className="sidebar-panel">
        <div className="sidebar-header">
          <span className="sidebar-title">Canvases</span>
          <button
            className="sidebar-close"
            onClick={onClose}
            aria-label="Close sidebar"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        <button className="sidebar-new-btn" onClick={handleNew}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          New Canvas
        </button>

        <div className="sidebar-list">
          {canvases.length === 0 ? (
            <div className="sidebar-empty">No canvases yet</div>
          ) : (
            canvases.map((canvas) => (
              <div
                key={canvas.id}
                className={`sidebar-item ${canvas.id === activeCanvasId ? 'active' : ''}`}
                onClick={() => handleSwitch(canvas.id)}
              >
                {renamingId === canvas.id ? (
                  <input
                    ref={renameInputRef}
                    className="sidebar-rename-input"
                    value={renameValue}
                    onChange={(e) => setRenameValue(e.target.value)}
                    onBlur={commitRename}
                    onKeyDown={handleRenameKeyDown}
                    onClick={(e) => e.stopPropagation()}
                  />
                ) : (
                  <>
                    <span className="sidebar-item-name">
                      {canvas.title || 'Untitled Canvas'}
                    </span>
                    <div className="sidebar-item-actions">
                      <button
                        className="sidebar-item-action"
                        onClick={(e) => handleDuplicate(e, canvas.id)}
                        title="Duplicate"
                        aria-label="Duplicate canvas"
                      >
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                          <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                        </svg>
                      </button>
                      <button
                        className="sidebar-item-action"
                        onClick={(e) => startRename(e, canvas)}
                        title="Rename"
                        aria-label="Rename canvas"
                      >
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                          <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                        </svg>
                      </button>
                      {canvases.length > 1 && (
                        <button
                          className="sidebar-item-action danger"
                          onClick={(e) => handleDelete(e, canvas.id)}
                          title="Delete"
                          aria-label="Delete canvas"
                        >
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="3 6 5 6 21 6" />
                            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                          </svg>
                        </button>
                      )}
                    </div>
                  </>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </aside>
  );
}
