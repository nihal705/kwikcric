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
    return;
  }
  
  const port = ports[index];
  const server = app.listen(port, 'localhost', () => {
  });
  
  server.on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
      tryPort(index + 1);
    }
  });
}

tryPort(0);