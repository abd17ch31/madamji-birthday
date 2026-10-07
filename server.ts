import express from 'express';
import path from 'path';
import fs from 'fs';

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

const IMAGES_FILE = path.join(DATA_DIR, 'images.json');

let imageSlots: Record<string, string> = {};
if (fs.existsSync(IMAGES_FILE)) {
  try {
    imageSlots = JSON.parse(fs.readFileSync(IMAGES_FILE, 'utf-8'));
  } catch {
    imageSlots = {};
  }
}

// 1. Get Image Slots
app.get('/api/images', (req, res) => {
  res.json({ slots: imageSlots });
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
