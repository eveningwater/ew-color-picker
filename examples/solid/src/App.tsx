import { createSignal, For } from 'solid-js';
import ColorField from './ColorField';
import './app.css';

const PRESETS = ['#6366f1', '#ef4444', '#22c55e', '#f59e0b'];

export default function App() {
  const [color, setColor] = createSignal('#6366f1');

  return (
    <main class="app">
      <h1>ew-color-picker + Solid</h1>
      <p class="lead">
        A controlled ColorField wrapper using signals: picker events update the
        signal, and signal changes flow back into the picker.
      </p>

      <div class="field">
        <ColorField value={color()} onChange={setColor} />
        <span class="value">{color()}</span>
      </div>

      <div class="actions">
        <For each={PRESETS}>
          {(preset) => (
            <button type="button" onClick={() => setColor(preset)}>
              {preset}
            </button>
          )}
        </For>
        <button type="button" onClick={() => setColor('#6366f1')}>
          Reset
        </button>
      </div>
    </main>
  );
}
