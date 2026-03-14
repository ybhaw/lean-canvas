import { useRef, useCallback, useEffect } from 'react';

const SECTION_NUMBERS = {
  problem: 1,
  customerSegments: 2,
  uniqueValue: 3,
  solution: 4,
  channels: 5,
  revenueStreams: 6,
  costStructure: 7,
  keyMetrics: 8,
  unfairAdvantage: 9,
};

export default function CanvasSection({ field, value, onChange, readOnly }) {
  const textareaRef = useRef(null);

  const autoGrow = useCallback(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = 'auto';
    el.style.height = el.scrollHeight + 'px';
  }, []);

  useEffect(() => {
    autoGrow();
  }, [value, autoGrow]);

  return (
    <div className="canvas-section" data-section={field.gridArea}>
      <div className="canvas-section-header">
        <span className="canvas-section-number">
          {SECTION_NUMBERS[field.key] || ''}
        </span>
        {field.label}
      </div>
      <div className="canvas-section-body">
        <textarea
          ref={textareaRef}
          className="canvas-section-textarea"
          placeholder={field.hint}
          value={value}
          onChange={(e) => onChange(field.key, e.target.value)}
          readOnly={readOnly}
          onInput={autoGrow}
          tabIndex={SECTION_NUMBERS[field.key] || 0}
        />
      </div>
    </div>
  );
}
