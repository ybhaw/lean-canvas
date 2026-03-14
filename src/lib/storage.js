const STORAGE_KEY = 'lean-canvas-collection';
const COLLECTION_VERSION = 1;

function generateId() {
  return 'canvas-' + Date.now() + '-' + Math.random().toString(36).slice(2, 8);
}

function getCollection() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const col = JSON.parse(raw);
    if (col && col.schemaVersion === COLLECTION_VERSION) return col;
    return null;
  } catch {
    return null;
  }
}

function saveCollection(col) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(col));
}

export function loadCollection() {
  const col = getCollection();
  if (col) return col;
  return { schemaVersion: COLLECTION_VERSION, activeCanvasId: null, canvases: [] };
}

export function addCanvas(title, data) {
  const col = loadCollection();
  const now = new Date().toISOString();
  const canvas = {
    id: generateId(),
    title: title || 'Untitled Canvas',
    data,
    createdAt: now,
    updatedAt: now,
  };
  col.canvases.unshift(canvas);
  col.activeCanvasId = canvas.id;
  saveCollection(col);
  return col;
}

export function updateCanvas(id, data, title) {
  const col = loadCollection();
  const canvas = col.canvases.find((c) => c.id === id);
  if (!canvas) return col;
  canvas.data = data;
  if (title !== undefined) canvas.title = title;
  canvas.updatedAt = new Date().toISOString();
  saveCollection(col);
  return col;
}

export function deleteCanvas(id) {
  const col = loadCollection();
  col.canvases = col.canvases.filter((c) => c.id !== id);
  if (col.activeCanvasId === id) {
    col.activeCanvasId = col.canvases.length > 0 ? col.canvases[0].id : null;
  }
  saveCollection(col);
  return col;
}

export function renameCanvas(id, newTitle) {
  const col = loadCollection();
  const canvas = col.canvases.find((c) => c.id === id);
  if (canvas) {
    canvas.title = newTitle;
    canvas.updatedAt = new Date().toISOString();
    saveCollection(col);
  }
  return col;
}

export function setActiveCanvas(id) {
  const col = loadCollection();
  col.activeCanvasId = id;
  saveCollection(col);
  return col;
}

export function duplicateCanvas(id) {
  const col = loadCollection();
  const source = col.canvases.find((c) => c.id === id);
  if (!source) return col;
  const now = new Date().toISOString();
  const canvas = {
    id: generateId(),
    title: source.title + ' (Copy)',
    data: { ...source.data },
    createdAt: now,
    updatedAt: now,
  };
  const idx = col.canvases.findIndex((c) => c.id === id);
  col.canvases.splice(idx + 1, 0, canvas);
  col.activeCanvasId = canvas.id;
  saveCollection(col);
  return col;
}
