import { BPEVisualizer } from './bpe-visualizer.js';

/**
 * BPE Visualizer UI Component
 * Renders the BPE simulation into an interactive HTML structure.
 */
export function renderBPEVisualizer(containerId, initialText = "el gato se sentó en la alfombra") {
  const container = document.getElementById(containerId);
  if (!container) return;

  // Reset container
  container.innerHTML = '';

  // Create UI Elements
  const wrapper = document.createElement('div');
  wrapper.className = 'bpe-visualizer-wrapper';
  wrapper.innerHTML = `
    <style>
      .bpe-visualizer-wrapper {
        font-family: "IBM Plex Mono", monospace;
        background: #171a16;
        color: #fefaf0;
        padding: 2rem;
        border-radius: 1rem;
        border: 3px solid #ffd60a;
        box-shadow: 8px 8px 0 #111111;
        width: 100%;
        box-sizing: border-box;
      }
      .bpe-controls {
        margin-bottom: 2rem;
        display: flex;
        gap: 1rem;
        align-items: center;
      }
      .bpe-input {
        flex: 1;
        padding: 0.8rem;
        font-family: inherit;
        background: rgba(255,255,255,0.05);
        border: 1px solid #ffd60a;
        color: #fff;
        border-radius: 4px;
      }
      .bpe-btn {
        background: #ffd60a;
        color: #111;
        border: none;
        padding: 0.8rem 1.5rem;
        font-family: "Archivo Black", sans-serif;
        text-transform: uppercase;
        cursor: pointer;
        box-shadow: 3px 3px 0 #111;
      }
      .bpe-btn:active {
        transform: translate(2px, 2px);
        box-shadow: 1px 1px 0 #111;
      }
      .bpe-display {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 2rem;
      }
      .bpe-column h3 {
        font-family: "Archivo Black", sans-serif;
        color: #ffd60a;
        text-transform: uppercase;
        font-size: 0.9rem;
        margin-bottom: 1rem;
        border-bottom: 1px solid rgba(255,214,10,0.3);
        padding-bottom: 0.5rem;
      }
      .bpe-tokens {
        display: flex;
        flex-wrap: wrap;
        gap: 4px;
      }
      .token {
        background: rgba(255,214,10,0.15);
        border: 1px solid rgba(255,214,10,0.4);
        padding: 2px 6px;
        border-radius: 4px;
        font-size: 1rem;
      }
      .bpe-steps {
        max-height: 300px;
        overflow-y: auto;
        font-size: 0.85rem;
      }
      .step-item {
        padding: 0.5rem;
        border-bottom: 1px solid rgba(255,255,255,0.05);
        display: flex;
        justify-content: space-between;
      }
      .step-item span:first-child {
        color: #ffd60a;
      }
      .step-item span:last-child {
        opacity: 0.7;
      }
    </style>
    <div class="bpe-controls">
      <input type="text" class="bpe-input" id="bpe-input" value="${initialText}" placeholder="Enter text in Spanish..." />
      <button class="bpe-btn" id="bpe-run-btn">Run BPE</button>
    </div>
    <div class="bpe-display">
      <div class="bpe-column">
        <h3>Current Tokens</h3>
        <div class="bpe-tokens" id="bpe-tokens-target"></div>
      </div>
      <div class="bpe-column">
        <h3>Merge History</h3>
        <div class="bpe-steps" id="bpe-steps-target"></div>
      </div>
    </div>
  `;
  container.appendChild(wrapper);

  const input = container.querySelector('#bpe-input');
  const btn = container.querySelector('#bpe-run-btn');
  const tokensTarget = container.querySelector('#bpe-tokens-target');
  const stepsTarget = container.querySelector('#bpe-steps-target');

  const run = () => {
    const text = input.value;
    const result = BPEVisualizer.simulate(text);

    // Render tokens
    tokensTarget.innerHTML = result.finalTokens
      .map(t => `<span class="token">${t === ' ' ? '&nbsp;' : t}</span>`)
      .join('');

    // Render steps
    stepsTarget.innerHTML = result.steps
      .map(step => `
        <div class="step-item">
          <span>${step.merged}</span>
          <span>(${step.count}x)</span>
        </div>
      `).join('');
  };

  btn.addEventListener('click', run);
  run(); // Initial run
}
