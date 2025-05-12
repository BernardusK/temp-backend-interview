const express = require('express');
const rateLimit = require('express-rate-limit');

const app = express();
const port = 3000;

// ✅ CORS headers (manually)
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "https://obscure-tribble-rvgw4wgw5v63w5r4-8000.app.github.dev"); // replace * with your actual FE origin
  res.header("Access-Control-Allow-Methods", "GET, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Content-Type");
  next();
});

// ✅ Handle preflight requests
app.options('*', (req, res) => {
  res.sendStatus(200);
});

// In-memory price state
let price = 300;

// Rate limiting
const limiter = rateLimit({
  windowMs: 60 * 1000,
  max: 6,
  message: { error: 'Too many requests. Please try again later.' }
});
app.use('/api/bnb-price', limiter);

// GET /api/bnb-price
app.get('/api/bnb-price', (req, res) => {
  const changePercent = (Math.random() * 0.04) - 0.02;
  price = parseFloat((price * (1 + changePercent)).toFixed(2));

  res.json({
    price,
    lastUpdated: new Date().toISOString()
  });
});

app.listen(port, () => {
  console.log(`BNB Price API listening on http://localhost:${port}`);
});
