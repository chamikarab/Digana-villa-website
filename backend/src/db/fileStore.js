import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import { getDefaultDatabase } from './seed.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DB_PATH = path.join(__dirname, '../../data/db.json');

let writeQueue = Promise.resolve();

async function ensureDb() {
  try {
    await fs.access(DB_PATH);
  } catch {
    await fs.mkdir(path.dirname(DB_PATH), { recursive: true });
    await fs.writeFile(DB_PATH, JSON.stringify(getDefaultDatabase(), null, 2), 'utf-8');
  }
}

export async function readDb() {
  await ensureDb();
  const raw = await fs.readFile(DB_PATH, 'utf-8');
  return JSON.parse(raw);
}

export async function updateDb(mutator) {
  writeQueue = writeQueue.then(async () => {
    const db = await readDb();
    const next = mutator(structuredClone(db));
    await fs.writeFile(DB_PATH, JSON.stringify(next, null, 2), 'utf-8');
    return next;
  });
  return writeQueue;
}

export function nightsBetween(checkIn, checkOut) {
  const start = new Date(`${checkIn}T00:00:00`);
  const end = new Date(`${checkOut}T00:00:00`);
  const diff = (end - start) / (1000 * 60 * 60 * 24);
  return Math.max(0, Math.round(diff));
}
