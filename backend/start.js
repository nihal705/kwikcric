const express = require('express');
const cors = require('cors');
const app = express();
app.use(cors());
app.use(express.json());

app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Server is working!' });
});

// Try ports one by one until one works
const ports = [3000, 3001, 3002, 3003, 4000, 5000, 8000, 9000];

function tryPort(index) {
  if (index >= ports.length) {
    console.log('❌ No available ports found');
    return;
  }
  
  const port = ports[index];
  const server = app.listen(port, 'localhost', () => {
    console.log(`✅ Server running on http://localhost:${port}`);
    console.log(`📋 Test: http://localhost:${port}/api/health`);
  });
  
  server.on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
      console.log(`Port ${port} is busy, trying next...`);
      tryPort(index + 1);
    }
  });
}

tryPort(0);