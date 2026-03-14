import { useState, useCallback, useRef, useEffect } from 'react';
import { loadCollection, addCanvas, updateCanvas, deleteCanvas, renameCanvas, setActiveCanvas, duplicateCanvas } from '../lib/storage';
import { createEmptyCanvas } from '../lib/canvas-fields';

export function useCanvasStore() {
  const [collection, setCollection] = useState(() => loadCollection());
  const saveTimerRef = useRef(null);

  const activeCanvas = collection.canvases.find((c) => c.id === collection.activeCanvasId) || null;
  const canvasData = activeCanvas?.data || createEmptyCanvas();

  // Listen for cross-tab storage changes
  useEffect(() => {
    const handler = (e) => {
      if (e.key === 'lean-canvas-collection') {
        setCollection(loadCollection());
      }
    };
    window.addEventListener('storage', handler);
    return () => window.removeEventListener('storage', handler);
  }, []);

  const createNew = useCallback((title, data) => {
    const d = data || createEmptyCanvas();
    const col = addCanvas(title || 'Untitled Canvas', d);
    setCollection({ ...col });
    return col;
  }, []);

  const switchTo = useCallback((id) => {
    const col = setActiveCanvas(id);
    setCollection({ ...col });
  }, []);

  const remove = useCallback((id) => {
    const col = deleteCanvas(id);
    setCollection({ ...col });
  }, []);

  const rename = useCallback((id, title) => {
    const col = renameCanvas(id, title);
    setCollection({ ...col });
  }, []);

  const duplicate = useCallback((id) => {
    const col = duplicateCanvas(id);
    setCollection({ ...col });
  }, []);

  const updateData = useCallback((newData, immediate = false) => {
    if (!collection.activeCanvasId) return;
    const id = collection.activeCanvasId;

    // Update local state immediately for responsive UI
    setCollection((prev) => {
      const updated = { ...prev };
      updated.canvases = prev.canvases.map((c) =>
        c.id === id ? { ...c, data: newData, title: newData.title || c.title, updatedAt: new Date().toISOString() } : c
      );
      return updated;
    });

    // Debounce localStorage writes
    if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
    const delay = immediate ? 0 : 500;
    saveTimerRef.current = setTimeout(() => {
      updateCanvas(id, newData, newData.title || undefined);
    }, delay);
  }, [collection.activeCanvasId]);

  // Cleanup timer on unmount
  useEffect(() => {
    return () => {
      if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
    };
  }, []);

  return {
    collection,
    canvases: collection.canvases,
    activeCanvasId: collection.activeCanvasId,
    activeCanvas,
    canvasData,
    createNew,
    switchTo,
    remove,
    rename,
    duplicate,
    updateData,
  };
}
