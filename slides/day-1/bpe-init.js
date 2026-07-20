(function() {
  'use strict';

  /**
   * BPE simulation logic
   */
  function simulateBPE(text) {
    let tokens = text.split('').map(char => char === ' ' ? ' ' : char);
    const steps = [];

    for (let iteration = 1; iteration <= 20; iteration++) {
      const counts = {};
      for (let i = 0; i < tokens.length - 1; i++) {
        const pair = `${tokens[i]}@@${tokens[i+1]}`;
        counts[pair] = (counts[pair] || 0) + 1;
      }

      let maxPair = null;
      let maxCount = 0;
      for (const pair in counts) {
        if (counts[pair] > maxCount) {
          maxCount = counts[pair];
          maxPair = pair;
        }
      }

      if (!maxPair || maxCount < 2) break;

      const [part1, part2] = maxPair.split('@@');
      const newTokens = [];
      for (let i = 0; i < tokens.length; i++) {
        if (tokens[i] === part1 && tokens[i+1] === part2) {
          newTokens.push(part1 + part2);
          i++;
        } else {
          newTokens.push(tokens[i]);
        }
      }

      tokens = newTokens;
      steps.push({
        iteration,
        merged: maxPair.replace('@@', ''),
        count: maxCount,
        tokens: [...tokens]
      });
    }

    return { finalTokens: tokens, steps };
  }

  /**
   * BPE UI rendering
   */
  function renderBPE(containerId, initialText) {
    const container = document.getElementById(containerId);
    if (!container) return;

    container.innerHTML = '';
    const wrapper = document.createElement('div');
    wrapper.className = 'bpe-visualizer-wrapper';
    wrapper.innerHTML = [
      '<style>',
      '.bpe-visualizer-wrapper { font-family: "IBM Plex Mono", monospace; background: #171a16; color: #fefaf0; padding: 2rem; border-radius: 1rem; border: 3px solid #ffd60a; box-shadow: 8px 8px 0 #111111; width: 100%; box-sizing: border-box; }',
      '.bpe-controls { margin-bottom: 2rem; display: flex; gap: 1rem; align-items: center; }',
      '.bpe-input { flex: 1; padding: 0.8rem; font-family: inherit; background: rgba(255,255,255,0.05); border: 1px solid #ffd60a; color: #fff; border-radius: 4px; }',
      '.bpe-btn { background: #ffd60a; color: #111; border: none; padding: 0.8rem 1.5rem; font-family: "Archivo Black", sans-serif; text-transform: uppercase; cursor: pointer; box-shadow: 3px 3px 0 #111; }',
      '.bpe-btn:active { transform: translate(2px, 2px); box-shadow: 1px 1px 0 #111; }',
      '.bpe-display { display: grid; grid-template-columns: 1fr 1fr; gap: 2rem; }',
      '.bpe-column h3 { font-family: "Archivo Black", sans-serif; color: #ffd60a; text-transform: uppercase; font-size: 0.9rem; margin-bottom: 1rem; border-bottom: 1px solid rgba(255,214,10,0.3); padding-bottom: 0.5rem; }',
      '.bpe-tokens { display: flex; flex-wrap: wrap; gap: 4px; }',
      '.token { background: rgba(255,214,10,0.15); border: 1px solid rgba(255,214,10,0.4); padding: 2px 6px; border-radius: 4px; font-size: 1rem; }',
      '.token.merged { background: rgba(100,200,255,0.25); border: 1px solid rgba(100,200,255,0.6); color: #8cf; }',
      '.bpe-steps { max-height: 300px; overflow-y: auto; font-size: 0.85rem; }',
      '.step-item { padding: 0.5rem; border-bottom: 1px solid rgba(255,255,255,0.05); display: flex; justify-content: space-between; }',
      '.step-item span:first-child { color: #ffd60a; }',
      '.step-item span:last-child { opacity: 0.7; }',
      '</style>',
      '<div class="bpe-controls">',
      '<input type="text" class="bpe-input" id="bpe-input" value="' + initialText + '" placeholder="Enter text in Spanish..." />',
      '<button class="bpe-btn" id="bpe-run-btn">Run BPE</button>',
      '</div>',
      '<div class="bpe-display">',
      '<div class="bpe-column"><h3>Current Tokens</h3><div class="bpe-tokens" id="bpe-tokens-target"></div></div>',
      '<div class="bpe-column"><h3>Merge History</h3><div class="bpe-steps" id="bpe-steps-target"></div></div>',
      '</div>'
    ].join('');

    container.appendChild(wrapper);

    const input = document.getElementById('bpe-input');
    const btn = document.getElementById('bpe-run-btn');
    const tokensTarget = document.getElementById('bpe-tokens-target');
    const stepsTarget = document.getElementById('bpe-steps-target');

    function run() {
      const text = input.value;
      const result = simulateBPE(text);
      tokensTarget.innerHTML = result.finalTokens
        .map(function(t) {
          var cls = t.length >= 2 ? 'token merged' : 'token';
          var display = t === ' ' ? '&nbsp;' : t;
          return '<span class="' + cls + '">' + display + '</span>';
        }).join('');
      stepsTarget.innerHTML = result.steps
        .filter(function(step) { return step.merged.trim().length >= 2; })
        .map(function(step) {
          return '<div class="step-item"><span>' + step.merged.trim() + '</span><span>(' + step.count + 'x)</span></div>';
        }).join('');
    }

    btn.addEventListener('click', run);
    run();
  }

  /**
   * Init: wait for Reveal, then initialize BPE on the right slide
   */
  var bpeInitialized = false;

  function initBPE() {
    if (bpeInitialized) return;
    var container = document.getElementById('bpe-interactive-container');
    if (container && container.children.length === 0) {
      renderBPE('bpe-interactive-container', 'el gato en la alfombra y el perro en el sofá y la rata en la cocina');
      bpeInitialized = true;
    }
  }

  function checkCurrentSlide() {
    var current = document.querySelector('.reveal .slides section.present');
    if (current && current.querySelector('#bpe-interactive-container')) {
      initBPE();
    }
  }

  // Wait for Reveal.js to be ready
  function whenReady() {
    if (typeof Reveal !== 'undefined' && Reveal.initialize) {
      Reveal.on('ready', checkCurrentSlide);
      Reveal.on('slidechanged', function(event) {
        if (event.currentSlide.querySelector('#bpe-interactive-container')) {
          initBPE();
        }
      });
      // If ready already fired, check now
      checkCurrentSlide();
    } else {
      setTimeout(whenReady, 100);
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', whenReady);
  } else {
    whenReady();
  }
})();