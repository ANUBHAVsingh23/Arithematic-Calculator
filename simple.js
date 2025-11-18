// Simple calculator logic — client-side only
(() => {
  const display = document.getElementById('display');
  const keys = document.querySelector('.keys');
  let first = null;
  let operator = null;
  let waitingForSecond = false;

  function updateDisplay(value) {
    display.textContent = String(value).slice(0, 18);
  }

  function calculate(a, op, b) {
    const x = Number(a);
    const y = Number(b);
    if (Number.isNaN(x) || Number.isNaN(y)) return null;
    switch (op) {
      case '+': return x + y;
      case '-': return x - y;
      case '*': return x * y;
      case '/': return y === 0 ? null : x / y;
      default: return null;
    }
  }

  keys.addEventListener('click', (e) => {
    const btn = e.target.closest('button');
    if (!btn) return;

    if (btn.hasAttribute('data-number')) {
      const num = btn.textContent;
      if (waitingForSecond) {
        updateDisplay(num === '.' ? '0.' : num);
        waitingForSecond = false;
      } else {
        const cur = display.textContent === '0' ? '' : display.textContent;
        if (num === '.' && cur.includes('.')) return;
        updateDisplay((cur + num) || '0');
      }
      return;
    }

    if (btn.dataset.action === 'clear') {
      first = null; operator = null; waitingForSecond = false; updateDisplay('0');
      return;
    }

    if (btn.dataset.action === 'neg') {
      const cur = display.textContent;
      if (cur === '0') return;
      updateDisplay((Number(cur) * -1).toString());
      return;
    }

    if (btn.dataset.action === 'percent') {
      const cur = Number(display.textContent);
      updateDisplay((cur / 100).toString());
      return;
    }

    if (btn.dataset.action === 'op') {
      const op = btn.dataset.value;
      if (operator && !waitingForSecond) {
        const result = calculate(first, operator, display.textContent);
        if (result === null) { updateDisplay('Error'); first = null; operator = null; return; }
        updateDisplay(result);
        first = String(result);
      } else {
        first = display.textContent;
      }
      operator = op;
      waitingForSecond = true;
      return;
    }

    if (btn.dataset.action === 'equals') {
      if (!operator || first === null) return;
      const result = calculate(first, operator, display.textContent);
      if (result === null) { updateDisplay('Error'); first = null; operator = null; waitingForSecond = false; return; }
      updateDisplay(result);
      first = null; operator = null; waitingForSecond = false;
      return;
    }
  });
})();
