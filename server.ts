import express from 'express';
import path from 'path';
import fs from 'fs';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';

const app = express();
const PORT = process.env.PORT || 3000;
const isProduction = process.env.NODE_ENV === 'production';

app.use(express.json({ limit: '15mb' }));
app.use(express.urlencoded({ extended: true, limit: '15mb' }));

// Persistent storage paths
const DATA_DIR = path.resolve(process.cwd(), 'data-store');
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

const WISHES_FILE = path.join(DATA_DIR, 'wishes.json');
const IMAGES_FILE = path.join(DATA_DIR, 'images.json');
const AUTH_FILE = path.join(DATA_DIR, 'auth.json');

// Initialize auth password (Default admin password: 'jyotibirthday')
let adminPasswordHash: string;
if (fs.existsSync(AUTH_FILE)) {
  try {
    const authData = JSON.parse(fs.readFileSync(AUTH_FILE, 'utf-8'));
    adminPasswordHash = authData.hash;
  } catch {
    adminPasswordHash = bcrypt.hashSync(process.env.ADMIN_PASSWORD || 'jyotibirthday', 10);
  }
} else {
  adminPasswordHash = bcrypt.hashSync(process.env.ADMIN_PASSWORD || 'jyotibirthday', 10);
  fs.writeFileSync(AUTH_FILE, JSON.stringify({ hash: adminPasswordHash }, null, 2));
}

// Active session tokens map (token -> expiration timestamp)
const activeSessions = new Map<string, number>();

// In-memory data structures
interface WishRecord {
  id: string;
  author: string;
  message: string;
  createdAt: string;
}

let wishes: WishRecord[] = [];
if (fs.existsSync(WISHES_FILE)) {
  try {
    wishes = JSON.parse(fs.readFileSync(WISHES_FILE, 'utf-8'));
  } catch {
    wishes = [];
  }
}

let imageSlots: Record<string, string> = {};
if (fs.existsSync(IMAGES_FILE)) {
  try {
    imageSlots = JSON.parse(fs.readFileSync(IMAGES_FILE, 'utf-8'));
  } catch {
    imageSlots = {};
  }
}

// Helper save functions
const saveWishes = () => {
  try {
    fs.writeFileSync(WISHES_FILE, JSON.stringify(wishes, null, 2));
  } catch (err) {
    console.error('Failed to save wishes:', err);
  }
};

const saveImages = () => {
  try {
    fs.writeFileSync(IMAGES_FILE, JSON.stringify(imageSlots, null, 2));
  } catch (err) {
    console.error('Failed to save images:', err);
  }
};

// Admin authentication middleware
const requireAdmin = (req: express.Request, res: express.Response, next: express.NextFunction) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const token = authHeader.split(' ')[1];
  const expiresAt = activeSessions.get(token);

  if (!expiresAt || Date.now() > expiresAt) {
    activeSessions.delete(token);
    return res.status(401).json({ error: 'Session expired or invalid' });
  }

  next();
};

/* =======================================
   PUBLIC API ENDPOINTS
   ======================================= */

// 1. Get Image Slots
app.get('/api/images', (req, res) => {
  res.json({ slots: imageSlots });
});

// 2. Submit a Wish (insert-only for public, never returns existing wishes)
app.post('/api/wishes', (req, res) => {
  const { author, message } = req.body;

  if (!author || typeof author !== 'string' || !author.trim()) {
    return res.status(400).json({ error: 'Author name is required' });
  }

  if (!message || typeof message !== 'string' || !message.trim()) {
    return res.status(400).json({ error: 'Wish message is required' });
  }

  // Word count check (max 1000 words)
  const words = message.trim().split(/\s+/).length;
  if (words > 1000) {
    return res.status(400).json({ error: 'Message exceeds 1000 words limit' });
  }

  const newWish: WishRecord = {
    id: `wish_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    author: author.trim().substring(0, 80),
    message: message.trim(),
    createdAt: new Date().toISOString(),
  };

  wishes.unshift(newWish);
  saveWishes();

  // Return success without leaking other wishes
  res.status(201).json({ success: true, id: newWish.id });
});

/* =======================================
   ADMIN API ENDPOINTS (Protected)
   ======================================= */

// 3. Admin Login (verifies password against bcrypt hash)
app.post('/api/admin/login', (req, res) => {
  const { password } = req.body;
  if (!password || typeof password !== 'string') {
    return res.status(400).json({ error: 'Password required' });
  }

  const isMatch = bcrypt.compareSync(password, adminPasswordHash);
  if (!isMatch) {
    return res.status(401).json({ error: 'Incorrect password' });
  }

  // Generate secure session token (24h expiration)
  const sessionToken = crypto.randomBytes(32).toString('hex');
  const expiresAt = Date.now() + 24 * 60 * 60 * 1000;
  activeSessions.set(sessionToken, expiresAt);

  res.json({ success: true, token: sessionToken });
});

// 4. Get all wishes (Admin only)
app.get('/api/admin/wishes', requireAdmin, (req, res) => {
  res.json({ wishes });
});

// 5. Delete individual wish (Admin only)
app.delete('/api/admin/wishes/:id', requireAdmin, (req, res) => {
  const { id } = req.params;
  const initialLen = wishes.length;
  wishes = wishes.filter(w => w.id !== id);
  if (wishes.length !== initialLen) {
    saveWishes();
  }
  res.json({ success: true });
});

// 6. Update image slot (Admin only)
app.post('/api/admin/images/:slotId', requireAdmin, (req, res) => {
  const { slotId } = req.params;
  const { imageData } = req.body;

  if (!imageData || typeof imageData !== 'string') {
    return res.status(400).json({ error: 'Image data is required' });
  }

  imageSlots[slotId] = imageData;
  saveImages();

  res.json({ success: true, url: imageData });
});

/* =======================================
   VITE MIDDLEWARE / STATIC ASSETS
   ======================================= */
async function startServer() {
  if (!isProduction) {
    const { createServer } = await import('vite');
    const vite = await createServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
  });
}

startServer();
