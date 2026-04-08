const express = require('express');
const bodyParser = require('body-parser');
const { ensureRedBike } = require('./utils/SeedRedBike');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// ===== MIDDLEWARE =====
app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '10mb' }));

// ===== API =====
app.get('/hello', (req, res) => {
  res.json({ message: 'Hello from server!' });
});

app.use('/api/admin', require('./api/admin.js'));
app.use('/api/customer', require('./api/customer.js'));

// ===== STATIC FILE (REACT BUILD) =====

// Admin build
app.use('/admin', express.static(path.resolve(__dirname, '../client-admin/build')));
app.get('/admin/*', (req, res) => {
  res.sendFile(path.resolve(__dirname, '../client-admin/build', 'index.html'));
});

// Customer build
app.use('/', express.static(path.resolve(__dirname, '../client-customer/build')));
app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, '../client-customer/build', 'index.html'));
});

// ===== START SERVER =====
app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
  ensureRedBike().catch((err) => {
    console.error('[seed] Failed to ensure red bike', err);
  });
});