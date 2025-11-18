const express = require('express');
const path = require('path');

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Basic calculator operations: op can be add, sub, mul, div, pow
app.post('/api/calc', (req, res) => {
  const { op, a, b } = req.body;

  // Validate numbers
  const x = Number(a);
  const y = Number(b);
  if (!op || Number.isNaN(x) || Number.isNaN(y)) {
    return res.status(400).json({ error: 'Invalid payload. Expect {op, a, b} where a and b are numbers.' });
  }

  let result;
  try {
    switch (op) {
      case 'add':
        result = x + y;
        break;
      case 'sub':
        result = x - y;
        break;
      case 'mul':
        result = x * y;
        break;
      case 'div':
        if (y === 0) return res.status(400).json({ error: 'Division by zero' });
        result = x / y;
        break;
      case 'pow':
        result = Math.pow(x, y);
        break;
      default:
        return res.status(400).json({ error: 'Unsupported op. Use one of add, sub, mul, div, pow' });
    }
  } catch (err) {
    return res.status(500).json({ error: 'Calculation error', details: err.message });
  }

  return res.json({ result });
});

// Health check
app.get('/api/health', (req, res) => res.json({ status: 'ok' }));

app.listen(port, () => {
  console.log(`Calculator server listening on http://localhost:${port}`);
});
