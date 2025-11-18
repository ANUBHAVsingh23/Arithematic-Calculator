document.addEventListener('DOMContentLoaded', () => {
  const aEl = document.getElementById('a');
  const bEl = document.getElementById('b');
  const opEl = document.getElementById('op');
  const calcBtn = document.getElementById('calcBtn');
  const resultEl = document.getElementById('result');

  const exprEl = document.getElementById('expr');
  const evalBtn = document.getElementById('evalBtn');
  const exprResultEl = document.getElementById('exprResult');

  calcBtn.addEventListener('click', async () => {
    const payload = {
      op: opEl.value,
      a: aEl.value,
      b: bEl.value
    };
    resultEl.textContent = 'Calculating...';

    // Try backend first; if it fails (no server/npm), fall back to client-side compute
    try {
      const resp = await fetch('/api/calc', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await resp.json().catch(() => null);
      if (resp.ok && data && typeof data.result !== 'undefined') {
        resultEl.textContent = 'Result: ' + data.result + ' (from server)';
        return;
      }

      // If server responded with an error or returned invalid data, try client-side
      const local = computeLocal(opEl.value, aEl.value, bEl.value);
      if (local.error) {
        resultEl.textContent = 'Error: ' + (data && data.error ? data.error : local.error);
      } else {
        resultEl.textContent = 'Result: ' + local.result + ' (calculated locally)';
      }
    } catch (err) {
      // Network or server not available — compute locally
      const local = computeLocal(opEl.value, aEl.value, bEl.value);
      if (local.error) resultEl.textContent = 'Error: ' + local.error + ' (no server)';
      else resultEl.textContent = 'Result: ' + local.result + ' (calculated locally)';
    }
  });

  // Local compute fallback
  function computeLocal(op, a, b) {
    const x = Number(a);
    const y = Number(b);
    if (Number.isNaN(x) || Number.isNaN(y)) return { error: 'Invalid numbers' };
    switch (op) {
      case 'add': return { result: x + y };
      case 'sub': return { result: x - y };
      case 'mul': return { result: x * y };
      case 'div': return y === 0 ? { error: 'Division by zero' } : { result: x / y };
      case 'pow': return { result: Math.pow(x, y) };
      default: return { error: 'Unsupported op' };
    }
  }

  evalBtn.addEventListener('click', () => {
    const expr = exprEl.value.trim();
    if (!expr) return exprResultEl.textContent = 'Result: —';

    // Very small sandbox: only allow digits, operators and parentheses
    if (!/^[0-9+\-*/(). \t^%]+$/.test(expr)) {
      return exprResultEl.textContent = 'Error: invalid characters in expression';
    }

    try {
      // Replace ^ with ** for JS exponentiation
      const safe = expr.replace(/\^/g, '**');
      // eslint-disable-next-line no-new-func
      const value = Function('return (' + safe + ')')();
      exprResultEl.textContent = 'Result: ' + value;
    } catch (err) {
      exprResultEl.textContent = 'Error: ' + err.message;
    }
  });
});
