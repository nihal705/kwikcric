import { Router } from 'express';

const router = Router();

// Mock users storage (temporary)
const users: any[] = [];

router.post('/register', async (req, res) => {
  const { email, username, password } = req.body;
  
  // Check if user exists
  if (users.find(u => u.email === email)) {
    return res.status(400).json({ error: 'User already exists' });
  }
  
  // Create user (simplified - no password hashing for now)
  const user = { id: Date.now().toString(), email, username, role: 'user' };
  users.push(user);
  
  res.json({ 
    success: true, 
    data: { 
      user, 
      accessToken: 'mock-token-' + Date.now() 
    } 
  });
});

router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  
  const user = users.find(u => u.email === email);
  if (!user) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }
  
  res.json({ 
    success: true, 
    data: { 
      user, 
      accessToken: 'mock-token-' + Date.now() 
    } 
  });
});

router.get('/profile', (req, res) => {
  res.json({ 
    success: true, 
    data: { 
      id: '1', 
      email: 'test@example.com', 
      username: 'testuser' 
    } 
  });
});

router.post('/logout', (req, res) => {
  res.json({ success: true, message: 'Logged out' });
});

export default router;