import express from 'express';
import puppeteer from 'puppeteer';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import cors from 'cors';
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const port = 8000;

app.use(express.json());
app.use(express.static('public'));
app.use(cors());

app.post('/api/screenshot', async (req, res) => {
  const { url } = req.body;
  
  if (!url) {
    return res.status(400).json({ error: 'URL is required' });
  }

  try {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    
    await page.setViewport({ width: 1280, height: 800 });
    await page.goto(url, { waitUntil: 'networkidle0' });
    
    const screenshot = await page.screenshot({ encoding: 'base64' });
    
    await browser.close();
    
    res.json({ screenshot: `data:image/png;base64,${screenshot}` });
  } catch (error) {
    console.error('Error taking screenshot:', error);
    res.status(500).json({ error: 'Failed to take screenshot' });
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});