import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');

// Read .env file manually
function getEnvConfig() {
  const envPath = path.join(projectRoot, '.env');
  const config = {};
  if (fs.existsSync(envPath)) {
    const lines = fs.readFileSync(envPath, 'utf8').split('\n');
    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith('#')) continue;
      const idx = trimmed.indexOf('=');
      if (idx !== -1) {
        const key = trimmed.slice(0, idx).trim();
        const val = trimmed.slice(idx + 1).trim();
        config[key] = val;
      }
    }
  }
  return config;
}

const env = getEnvConfig();
const CLOUD_NAME = env.VITE_CLOUDINARY_CLOUD_NAME || process.env.VITE_CLOUDINARY_CLOUD_NAME;
const API_KEY = env.CLOUDINARY_API_KEY || process.env.CLOUDINARY_API_KEY;
const API_SECRET = env.CLOUDINARY_API_SECRET || process.env.CLOUDINARY_API_SECRET;
const FOLDER = env.VITE_CLOUDINARY_FOLDER || 'wedding/wedding-frames';

if (!CLOUD_NAME || !API_KEY || !API_SECRET) {
  console.error('\n❌ Missing credentials!');
  console.error('Please make sure .env contains:');
  console.error('VITE_CLOUDINARY_CLOUD_NAME=...');
  console.error('CLOUDINARY_API_KEY=...');
  console.error('CLOUDINARY_API_SECRET=...\n');
  process.exit(1);
}

const framesDir = path.join(projectRoot, 'public', 'frames');
if (!fs.existsSync(framesDir)) {
  console.error(`❌ Frames directory not found at: ${framesDir}`);
  process.exit(1);
}

const files = fs.readdirSync(framesDir)
  .filter(f => f.startsWith('ezgif-frame-') && f.endsWith('.jpg'))
  .sort();

console.log(`\n🚀 Starting upload of ${files.length} frames to Cloudinary...`);
console.log(`Cloud Name : ${CLOUD_NAME}`);
console.log(`Target Path: ${FOLDER}/ezgif-frame-001 ... ezgif-frame-160\n`);

function generateSignature(paramsToSign, secret) {
  const sortedKeys = Object.keys(paramsToSign).sort();
  const serialized = sortedKeys.map(k => `${k}=${paramsToSign[k]}`).join('&');
  return crypto.createHash('sha1').update(serialized + secret).digest('hex');
}

async function uploadSingleFrame(fileName, index) {
  const filePath = path.join(framesDir, fileName);
  const fileBuffer = fs.readFileSync(filePath);
  const base64Data = `data:image/jpeg;base64,${fileBuffer.toString('base64')}`;

  const frameBaseName = fileName.replace(/\.jpg$/i, ''); // e.g. ezgif-frame-001
  const publicId = `${FOLDER}/${frameBaseName}`;
  const timestamp = Math.floor(Date.now() / 1000);

  const paramsToSign = {
    overwrite: 'true',
    public_id: publicId,
    timestamp: String(timestamp)
  };

  const signature = generateSignature(paramsToSign, API_SECRET);

  const formData = new FormData();
  formData.append('file', base64Data);
  formData.append('api_key', API_KEY);
  formData.append('timestamp', String(timestamp));
  formData.append('public_id', publicId);
  formData.append('overwrite', 'true');
  formData.append('signature', signature);

  const url = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`;
  const res = await fetch(url, {
    method: 'POST',
    body: formData
  });

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`Failed (${res.status}): ${errorText}`);
  }

  const json = await res.json();
  return json.secure_url;
}

async function uploadAll() {
  const CONCURRENCY = 5; // 5 images simultaneously
  let currentIndex = 0;
  let successful = 0;
  let failed = 0;

  async function worker() {
    while (currentIndex < files.length) {
      const idx = currentIndex++;
      const file = files[idx];
      try {
        await uploadSingleFrame(file, idx);
        successful++;
        process.stdout.write(`\r[${successful + failed}/${files.length}] Uploaded: ${file} ✅`);
      } catch (err) {
        failed++;
        console.error(`\n❌ Error uploading ${file}:`, err.message);
      }
    }
  }

  const workers = Array.from({ length: CONCURRENCY }, () => worker());
  await Promise.all(workers);

  console.log(`\n\n🎉 Done! Successfully uploaded: ${successful}/${files.length} frames.`);
  if (failed > 0) {
    console.warn(`⚠️ Failed: ${failed} frames.`);
  }
}

uploadAll().catch(console.error);
