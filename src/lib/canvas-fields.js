export const FIELDS = [
  { key: 'problem', label: 'Problem', hint: 'Top 3 problems', gridArea: 'problem' },
  { key: 'solution', label: 'Solution', hint: 'Top 3 features', gridArea: 'solution' },
  { key: 'keyMetrics', label: 'Key Metrics', hint: 'Key activities you measure', gridArea: 'metrics' },
  { key: 'uniqueValue', label: 'Unique Value Proposition', hint: 'Single, clear, compelling message', gridArea: 'uvp' },
  { key: 'unfairAdvantage', label: 'Unfair Advantage', hint: "Can't be easily copied or bought", gridArea: 'advantage' },
  { key: 'channels', label: 'Channels', hint: 'Path to customers', gridArea: 'channels' },
  { key: 'customerSegments', label: 'Customer Segments', hint: 'Target customers', gridArea: 'customers' },
  { key: 'costStructure', label: 'Cost Structure', hint: 'Customer acquisition costs, hosting, etc.', gridArea: 'cost' },
  { key: 'revenueStreams', label: 'Revenue Streams', hint: 'Revenue model, lifetime value, etc.', gridArea: 'revenue' },
];

export const SCHEMA_VERSION = 1;

export function createEmptyCanvas() {
  const data = { v: SCHEMA_VERSION, title: '' };
  for (const f of FIELDS) data[f.key] = '';
  return data;
}

export function validateCanvasData(data) {
  if (!data || typeof data !== 'object') return null;
  const clean = { v: SCHEMA_VERSION, title: String(data.title || '') };
  for (const f of FIELDS) {
    clean[f.key] = String(data[f.key] || '');
  }
  return clean;
}
