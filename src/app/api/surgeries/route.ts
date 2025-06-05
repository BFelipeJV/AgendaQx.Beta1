import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';

const DATA_PATH = path.join(process.cwd(), 'data', 'surgeries.json');
const AUTH_TOKEN = process.env.API_TOKEN || 'secret-token';

async function readSurgeries(): Promise<any[]> {
  try {
    const data = await fs.readFile(DATA_PATH, 'utf8');
    return JSON.parse(data || '[]');
  } catch {
    return [];
  }
}

async function writeSurgeries(surgeries: any[]) {
  await fs.mkdir(path.dirname(DATA_PATH), { recursive: true });
  await fs.writeFile(DATA_PATH, JSON.stringify(surgeries, null, 2));
}

function authorized(req: NextRequest): boolean {
  const header = req.headers.get('authorization');
  return header === `Bearer ${AUTH_TOKEN}`;
}

export async function GET(req: NextRequest) {
  if (!authorized(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const surgeries = await readSurgeries();
  return NextResponse.json(surgeries);
}

export async function POST(req: NextRequest) {
  if (!authorized(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const newItem = await req.json();
  const surgeries = await readSurgeries();
  if (!newItem.id) newItem.id = uuidv4();
  surgeries.push(newItem);
  await writeSurgeries(surgeries);
  return NextResponse.json(newItem, { status: 201 });
}

export async function PUT(req: NextRequest) {
  if (!authorized(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const updated = await req.json();
  const surgeries = await readSurgeries();
  const idx = surgeries.findIndex(s => s.id === updated.id);
  if (idx === -1) return NextResponse.json({ error: 'Not Found' }, { status: 404 });
  surgeries[idx] = updated;
  await writeSurgeries(surgeries);
  return NextResponse.json(updated);
}

export async function DELETE(req: NextRequest) {
  if (!authorized(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const id = new URL(req.url).searchParams.get('id');
  if (!id) return NextResponse.json({ error: 'ID required' }, { status: 400 });
  const surgeries = await readSurgeries();
  const idx = surgeries.findIndex(s => s.id === id);
  if (idx === -1) return NextResponse.json({ error: 'Not Found' }, { status: 404 });
  const removed = surgeries.splice(idx, 1)[0];
  await writeSurgeries(surgeries);
  return NextResponse.json(removed);
}
