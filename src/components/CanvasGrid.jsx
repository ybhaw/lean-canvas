import { FIELDS } from '../lib/canvas-fields';
import CanvasSection from './CanvasSection';
import './CanvasGrid.css';

export default function CanvasGrid({ data, onChange, readOnly }) {
  return (
    <div className="canvas-grid-wrapper">
      <div className="canvas-grid">
        {FIELDS.map((field) => (
          <CanvasSection
            key={field.key}
            field={field}
            value={data[field.key] || ''}
            onChange={onChange}
            readOnly={readOnly}
          />
        ))}
      </div>
    </div>
  );
}
