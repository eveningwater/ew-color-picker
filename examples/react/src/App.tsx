import { useState } from 'react';
import ColorField from './ColorField';
import './app.css';

const PRESETS = ['#6366f1', '#ef4444', '#22c55e', '#f59e0b'];

export default function App() {
  const [color, setColor] = useState('#6366f1');

  return (
    <main className="app">
      <h1>ew-color-picker + React</h1>
      <p className="lead">
        A controlled ColorField wrapper: picker events update React state, and
        state changes flow back into the picker.
      </p>

      <div className="field">
        <ColorField value={color} onChange={setColor} />
        <span className="value">{color}</span>
      </div>

      <div className="actions">
        {PRESETS.map((preset) => (
          <button key={preset} type="button" onClick={() => setColor(preset)}>
            {preset}
          </button>
        ))}
        <button type="button" onClick={() => setColor('#6366f1')}>
          Reset
        </button>
      </div>
    </main>
  );
}
