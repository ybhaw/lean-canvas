import { useEffect, useRef } from 'react';
import { marked } from 'marked';
import readme from '../../README.md?raw';
import './AboutModal.css';

const html = marked.parse(readme);

export default function AboutModal({ onClose }) {
  const backdropRef = useRef(null);

  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [onClose]);

  const handleBackdropClick = (e) => {
    if (e.target === backdropRef.current) onClose();
  };

  return (
    <div className="about-backdrop" ref={backdropRef} onClick={handleBackdropClick}>
      <div className="about-modal">
        <button className="about-close" onClick={onClose} aria-label="Close">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
        <div className="about-content" dangerouslySetInnerHTML={{ __html: html }} />
      </div>
    </div>
  );
}
