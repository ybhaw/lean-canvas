import { useState, useCallback, useEffect } from 'react';
import { useCanvasStore } from './hooks/useCanvasStore';
import { useUrlCodec } from './hooks/useUrlCodec';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import CanvasGrid from './components/CanvasGrid';
import SharedBanner from './components/SharedBanner';
import './App.css';

function getInitialTheme() {
  const stored = localStorage.getItem('lean-canvas-theme');
  if (stored === 'light' || stored === 'dark') return stored;
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

export default function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [theme, setTheme] = useState(getInitialTheme);

  const store = useCanvasStore();
  const { sharedData, isShared, error, clearShared, dismissError, getShareUrl } = useUrlCodec();

  // Apply theme to document
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('lean-canvas-theme', theme);
  }, [theme]);

  // Create initial canvas if collection is empty and not viewing shared
  useEffect(() => {
    if (!isShared && store.canvases.length === 0) {
      store.createNew('My First Canvas');
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const displayData = isShared ? sharedData : store.canvasData;

  const handleFieldChange = useCallback((key, value) => {
    if (isShared) return;
    const newData = { ...store.canvasData, [key]: value };
    store.updateData(newData);
  }, [isShared, store]);

  const handleTitleChange = useCallback((e) => {
    if (isShared) return;
    const newData = { ...store.canvasData, title: e.target.value };
    store.updateData(newData);
  }, [isShared, store]);

  const handleShare = useCallback(() => {
    return getShareUrl(store.canvasData);
  }, [getShareUrl, store.canvasData]);

  const handleNewCanvas = useCallback(() => {
    store.createNew('Untitled Canvas');
  }, [store]);

  const handleSaveCopy = useCallback(() => {
    if (!sharedData) return;
    store.createNew(sharedData.title || 'Shared Canvas', sharedData);
    clearShared();
  }, [sharedData, store, clearShared]);

  const toggleTheme = useCallback(() => {
    setTheme((t) => (t === 'dark' ? 'light' : 'dark'));
  }, []);

  const toggleSidebar = useCallback(() => {
    setSidebarOpen((o) => !o);
  }, []);

  if (!displayData) return null;

  return (
    <div className="app">
      <div className="app-layout">
        {!isShared && (
          <Sidebar
            open={sidebarOpen}
            onClose={() => setSidebarOpen(false)}
            canvases={store.canvases}
            activeCanvasId={store.activeCanvasId}
            onSwitch={store.switchTo}
            onNew={handleNewCanvas}
            onRename={store.rename}
            onDelete={store.remove}
            onDuplicate={store.duplicate}
          />
        )}

        <div className="app-content">
          <Header
            onToggleSidebar={toggleSidebar}
            onShare={handleShare}
            onNewCanvas={handleNewCanvas}
            theme={theme}
            onToggleTheme={toggleTheme}
            isShared={isShared}
          />

          {isShared && (
            <SharedBanner onSaveCopy={handleSaveCopy} onDismiss={clearShared} />
          )}

          {error && (
            <div className="error-banner">
              <span>{error}</span>
              <button onClick={dismissError}>Dismiss</button>
            </div>
          )}

          <div className="app-main">
            <div className="canvas-title-wrapper">
              <input
                className="canvas-title-input"
                type="text"
                placeholder="Untitled Canvas"
                value={displayData.title || ''}
                onChange={handleTitleChange}
                readOnly={isShared}
              />
            </div>

            <CanvasGrid
              data={displayData}
              onChange={handleFieldChange}
              readOnly={isShared}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
